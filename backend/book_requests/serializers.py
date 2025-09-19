from rest_framework import serializers
from .models import BookRequest

class BookRequestSerializer(serializers.ModelSerializer):
    member_username = serializers.ReadOnlyField(source='member.username')
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = BookRequest
        fields = ['id', 'book', 'book_title', 'member', 'member_username', 'request_date', 'status', 'is_active']
        read_only_fields = ['request_date', 'status', 'is_active']