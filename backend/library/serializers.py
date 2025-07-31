
from rest_framework import serializers
from .models import User, Book, LendingRecord, Reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'role', 'phone']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__' 

class LendingRecordSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    member_username = serializers.CharField(source='member.username', read_only=True)

    class Meta:
        model = LendingRecord
        fields = '__all__' 


class ReservationSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    member_username = serializers.CharField(source='member.username', read_only=True)
    class Meta:
        model = Reservation
        fields = '__all__' 