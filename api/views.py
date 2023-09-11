from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import FileResponse
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, NetParamsSerializer
from .forms import UploadFileForm, NetParamsForm
from .models import NetParamsModel
from training.main import train_network
import json
import os


class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            if request.data['password'] != request.data['confirmPassword']:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = serializer.save()
                login(request, user)
                return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({'success': 'User logged in successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        request.session.flush()
        return Response({'success': 'User logged out successfully'}, status=status.HTTP_200_OK)
        # return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)


def handle_uploaded_file(f, file_name):
    with open(f"././datasets/{file_name}.csv", "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)


class UploadFileView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser,)

    def post(self, request, format=None):
        if request.user.is_authenticated:
            form = UploadFileForm(request.POST, request.FILES)
            if form.is_valid():
                handle_uploaded_file(request.FILES['file'], file_name=str(request.user))
                return Response({}, status=status.HTTP_201_CREATED)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class DownloadModelView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.is_authenticated:
            username = request.user.username
            file_path = os.path.join('nn_models', f'{username}.pth')
            print(file_path)

            if os.path.exists(file_path):
                return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=f"model_{username}.pth")
            else:
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateNetView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    form_class = NetParamsForm
    serializer_class = NetParamsSerializer

    def get(self, request, format=None):
        if request.user.is_authenticated:
            content = {'user': request.user.username}
            return Response(content)

        return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        if request.user.is_authenticated:
            form = self.form_class(request.data)
            if form.is_valid():
                model_data = {
                    'username': str(request.user),
                    'training_size': form.cleaned_data['training_size'],
                    'loss': form.cleaned_data['loss'],
                    'optimizer': form.cleaned_data['optimizer'],
                    'lr': form.cleaned_data['lr'],
                    'wd': form.cleaned_data['wd'],
                    'epochs': form.cleaned_data['epochs'],
                    'batch': form.cleaned_data['batch'],
                    'layers': json.dumps(request.data.get('layers', '{}')),
                }

                # if user already has a network, then delete it
                if NetParamsModel.objects.filter(username=model_data['username']).exists():
                    NetParamsModel.objects.filter(username=model_data['username']).delete()

                # create a new user's network
                serializer = self.serializer_class(data=model_data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid form data'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)


class TrainNetView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.is_authenticated:
            content = {'user': request.user.username}
            return Response(content)

        return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        if request.user.is_authenticated:
            username = str(request.user)
            params = NetParamsModel.objects.get(username=username)

            drop_fields = ['id', 'created_at']
            params_dict = {field.name: getattr(params, field.name) for field in params._meta.fields if field.name not in drop_fields}
            params_dict['layers'] = json.loads(params_dict['layers'])

            results_dict = train_network(params_dict)

            return Response(results_dict, status=status.HTTP_200_OK)

        return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)
