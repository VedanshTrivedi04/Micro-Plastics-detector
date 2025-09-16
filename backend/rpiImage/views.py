from rest_framework import generics, permissions
from .models import UploadedImage
from .serializers import UploadedImageSerializer

class ImageUploadView(generics.CreateAPIView):
    serializer_class = UploadedImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)   # ✅ attach JWT user


class ImageListView(generics.ListAPIView):
    serializer_class = UploadedImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UploadedImage.objects.filter(user=self.request.user).order_by('-uploaded_at')
