from rest_framework import serializers
from .models import UploadedImage
from drf_extra_fields.fields import Base64ImageField

class UploadedImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = UploadedImage
        fields = ['id', 'user', 'image', 'uploaded_at']
