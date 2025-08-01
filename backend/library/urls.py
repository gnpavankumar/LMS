from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import (TokenObtainPairView, TokenRefreshView)
from .views import UserViewSet, BookViewSet, LendingRecordViewSet, ReservationViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'lending-records', LendingRecordViewSet)
router.register(r'reservations', ReservationViewSet)
urlpatterns = [
    path('api/', include(router.urls)),
    path("",views.homeview),
    path("api/token",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/token/refresh/",TokenRefreshView.as_view(), name='token_refresh')

]




