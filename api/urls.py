from django.urls import path
from .views import main, RegistrationView, LoginView, LogoutView, UploadFileView, CreateNetView


urlpatterns = [
    path('', main),
    path('sign-up', RegistrationView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('upload', UploadFileView.as_view()),
    path('create', CreateNetView.as_view())
]
