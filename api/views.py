from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer


def main(request):
    return HttpResponse("Hello")


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
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateNetView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            content = {'user': request.user.username}
            return Response(content)
        else:
            return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        print("POST")
        if request.user.is_authenticated:
            print(request.data)
            file = request.data['file']
            print(file)
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Authentication error'}, status=status.HTTP_401_UNAUTHORIZED)
