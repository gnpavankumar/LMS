from django.shortcuts import render
from accounts.permissions import IsLibrarianOrAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from django.http import Http404

class BookListCreateAPIView(APIView):
    # create, list
    permission_classes=[IsLibrarianOrAdmin]
    def get(self,request, format=None):
        books=Book.objects.all().order_by('title')
        serializer=BookSerializer(books,many=True)
        return Response(serializer.data)
    def post(self,request, format=None):
        serializer=BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class BookDetailAPIView(APIView):
    
    # retrieve , put, patch, detete
    def get_permissions(self):
        """
        Allow all authenticated users to GET.
        Only librarians or admins can PUT, PATCH, or DELETE.
        """
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsLibrarianOrAdmin()]

    def get_object(self, pk):
        """
        Helper method to get a book object from the database or raise a 404 error.
        """
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve a single book.
        """
        book = self.get_object(pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        """
        Handle PUT requests to fully update a single book.
        """
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk, format=None):
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a single book.
        """
        book = self.get_object(pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


