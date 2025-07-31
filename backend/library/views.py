from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import User, Book, LendingRecord, Reservation
from .serializers import UserSerializer, BookSerializer, LendingRecordSerializer, ReservationSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


def homeview(request):
    return render(request,'home.html')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] 

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated] 

class LendingRecordViewSet(viewsets.ModelViewSet):
    queryset = LendingRecord.objects.all()
    serializer_class = LendingRecordSerializer
    permission_classes = [permissions.IsAuthenticated] 

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated] 

