from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('sign-up', index),
    path('login', index),
    path('create', index),
    path('dashboard', index)
]
