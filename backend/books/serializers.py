from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'isbn', 'category', 'language', 'publication_year', 
                 'total_copies', 'available_copies', 'description', 'cover_image_url', 'is_available']
        read_only_fields = ['id', 'available_copies']

