from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import User, Book, LendingRecord, Reservation
from .serializers import UserSerializer, BookSerializer, LendingRecordSerializer, ReservationSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from imagekitio import ImageKit
from .permissions import IsAdmin, IsLibrarianOrAdmin, IsMember

def homeview(request):
    return render(request,'home.html')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsLibrarianOrAdmin] 

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated] 

class LendingRecordViewSet(viewsets.ModelViewSet):
    queryset = LendingRecord.objects.all()
    serializer_class = LendingRecordSerializer
    permission_classes = [IsLibrarianOrAdmin] 

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated] 


class BookUploadView(APIView):
    def post(self, request, *args, **kwargs):
        
        imagekit = ImageKit(
            private_key=settings.IMAGEKIT_PRIVATE_KEY,
            public_key=settings.IMAGEKIT_PUBLIC_KEY,
            url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
        )
        image_file = request.FILES.get('cover_image_file')
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            upload_response = imagekit.upload(
                file=image_file,
                file_name=image_file.name
            )
            image_url = upload_response.url
        except Exception as e:
            return Response({"error": f"Image upload failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = request.data.copy()
        data['cover_image_url'] = image_url  
        
        data.pop('cover_image_file', None)

        serializer = BookSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

