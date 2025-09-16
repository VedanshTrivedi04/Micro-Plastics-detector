from django.urls import path
from account import views as UserViews
from rpiImage.views import ImageUploadView, ImageListView   # import your image views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 🔹 User auth routes
    path('register/', UserViews.RegisterView.as_view(), name='register'), 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 🔹 Image routes
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('images/', ImageListView.as_view(), name='image-list'),
]
