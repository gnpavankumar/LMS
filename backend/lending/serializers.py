from rest_framework import serializers
from .models import LendingRecord

class LendingRecordSerializer(serializers.ModelSerializer):
    member_username = serializers.ReadOnlyField(source='member.username')
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = LendingRecord
        fields = ['id', 'member', 'member_username', 'book', 'book_title', 'issued_on', 'due_date', 'return_date', 'fine_amount', 'is_overdue']
        read_only_fields = ['issued_on', 'fine_amount', 'is_overdue']