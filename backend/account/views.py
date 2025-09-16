from django.shortcuts import render
from rest_framework import generics
from .serializers import Userserializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny


class RegisterView (generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class=Userserializer
    permission_classes=[AllowAny] 