from rest_framework import serializers
from django.contrib.auth.models import User
from .models import NetParamsModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class NetParamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetParamsModel
        fields = '__all__'
