from django.shortcuts import render
from rest_framework import viewsets
from accounts.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import User
from rest_framework.decorators import api_view, action
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from django.http import Http404

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['list', 'create']:
            return [IsLibrarianOrAdmin()]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [IsAuthenticated(), IsUserOrLibrarianOrAdmin()]
        elif self.action == 'destroy':
            return [IsLibrarianOrAdmin()]
        return []
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'admin':
                return User.objects.all().order_by('username')
            elif user.role == 'librarian':
                return User.objects.filter(role='member').order_by('username')
            else:
                return User.objects.filter(pk=user.pk)
        return User.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.role == 'librarian':
            requested_role = request.data.get('role', 'member')
            if requested_role in ['librarian', 'admin']:
                return Response(
                    {"detail": "Librarians cannot create other librarians or admins."},
                    status=status.HTTP_403_FORBIDDEN
                )
        return super().create(request, *args, **kwargs)

    

class MemberDashboardView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsMember]

    def get_object(self):
        return self.request.user

class LibrarianDashboardView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsLibrarianOrAdmin]

    def get_object(self):
        return self.request.user
        
class AdminDashboardView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh = request.data.get('refresh')
        if not refresh:
            return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_205_RESET_CONTENT)