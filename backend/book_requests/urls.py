from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookRequestViewSet

router = DefaultRouter()
router.register(r'book-requests', BookRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]