from django.urls import path
from .views import main, RegistrationView, LoginView


urlpatterns = [
    path('', main),
    path('sign-up', RegistrationView.as_view()),
    path('login', LoginView.as_view())
]
