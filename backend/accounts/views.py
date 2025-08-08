from django.shortcuts import render
from rest_framework import viewsets
from accounts.permissions import IsLibrarianOrAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from django.http import Http404

class UserViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['retrieve','update','partial_update']:       
          return [IsAuthenticated()]
        return [IsLibrarianOrAdmin()] 
    # permission_classes=[IsAuthenticated]
    # queryset=User.objects.all()
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'admin':
                return User.objects.all().order_by('username')
            elif user.role == 'librarian':
                return User.objects.filter(role='member').order_by('username')
            else:
                return User.objects.filter(pk=user.pk)
        
    serializer_class = UserSerializer
    