from django.urls import path
from .views import main, RegistrationView, LoginView, CreateNetView


urlpatterns = [
    path('', main),
    path('sign-up', RegistrationView.as_view()),
    path('login', LoginView.as_view()),
    path('create', CreateNetView.as_view())
]
