from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LendingRecordViewSet

router = DefaultRouter()
router.register(r'lending-records', LendingRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
