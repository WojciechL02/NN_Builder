from django.urls import path
from .views import RegistrationView, LoginView, LogoutView, UploadFileView, DownloadModelView, CreateNetView, TrainNetView


urlpatterns = [
    path('sign-up', RegistrationView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('upload', UploadFileView.as_view()),
    path('download', DownloadModelView.as_view()),
    path('create', CreateNetView.as_view()),
    path('train', TrainNetView.as_view())
]
