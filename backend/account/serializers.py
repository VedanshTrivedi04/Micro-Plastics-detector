from django.contrib.auth.models import User
from rest_framework import serializers


class Userserializer(serializers.ModelSerializer) :
    password = serializers.CharField(write_only=True, style = {'input_type':'password'},min_length=8)
    class Meta :
        model = User
        fields = ['username','email','password'  ]

    def create (self, validated_data):
        #~> This  validate the data stores ony three fields username pass and email for other deatail we use the manually option
        # user= User.objects.create_user(**validated_data)

        #~> This way we can manualy validate the data 
        user= User.objects.create_user(
         email=validated_data['email'],
         username=validated_data['username'],
        
         password=validated_data['password']
          
            
        )
        return user
        
