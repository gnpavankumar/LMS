from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BookViewSet, LendingRecordViewSet, ReservationViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'lending-records', LendingRecordViewSet)
router.register(r'reservations', ReservationViewSet)
urlpatterns = [
    path('api/', include(router.urls)),
    path("",views.homeview)
    
]




