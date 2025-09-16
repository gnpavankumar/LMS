from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.title')
    member_username = serializers.ReadOnlyField(source='member.username')

    class Meta:
        model = Reservation
        fields = ['id', 'book', 'book_title', 'member', 'member_username', 'reservation_date', 'position']
        read_only_fields = ['reservation_date', 'position']