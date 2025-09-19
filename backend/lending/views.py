from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LendingRecord
from .serializers import LendingRecordSerializer
from accounts.permissions import IsLibrarianOrAdmin
from books.models import Book
import datetime
from accounts.models import User
from django.utils import timezone
from reservations.models import Reservation
from book_requests.models import BookRequest
class LendingRecordViewSet(viewsets.ModelViewSet):
    queryset = LendingRecord.objects.all()
    serializer_class = LendingRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['librarian', 'admin']:
            return LendingRecord.objects.all()
        return LendingRecord.objects.filter(member=user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdmin]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['post'], url_path='lend')
    def lend_book(self, request):
        book_id = request.data.get('book_id')
        member_id = request.data.get('member_id')
        
        try:
            book = Book.objects.get(id=book_id)
            if book.available_copies <= 0:
                return Response({'error': 'No copies of this book are available.'}, status=status.HTTP_400_BAD_REQUEST)
            
            member = User.objects.get(id=member_id)
            
            # Set due date (e.g., 14 days from now)
            due_date = datetime.datetime.now() + datetime.timedelta(days=14)
            
            # Create a lending record
            lending = LendingRecord.objects.create(
                book=book,
                member=member,
                due_date=due_date
            )
            
            # Update book's available copies
            book.available_copies -= 1
            book.save()
            
            serializer = self.get_serializer(lending)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)
            
    @action(detail=True, methods=['post'], url_path='return')
    def return_book(self, request, pk=None):
        try:
            lending = self.get_object()
            if lending.return_date:
                return Response({'error': 'This book has already been returned.'}, status=status.HTTP_400_BAD_REQUEST)

            lending.return_date = timezone.now()
            if lending.due_date < lending.return_date:
                days_overdue = (lending.return_date.date() - lending.due_date.date()).days
                fine_amount = days_overdue * 0.50
                lending.fine_amount = fine_amount
                lending.is_overdue = True
            lending.save()

            book = lending.book
            book.available_copies += 1
            book.save()


            next_reservation = Reservation.objects.filter(book=book).order_by('position').first()
            if next_reservation:

                BookRequest.objects.create(
                    book=book,
                    member=next_reservation.member,
                    status='lending'
                )
            serializer = self.get_serializer(lending)
            return Response(serializer.data)
            
        except LendingRecord.DoesNotExist:
            return Response({'error': 'Lending record not found.'}, status=status.HTTP_404_NOT_FOUND)