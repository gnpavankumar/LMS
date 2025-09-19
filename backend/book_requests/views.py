from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BookRequest
from .serializers import BookRequestSerializer
from books.models import Book
from reservations.models import Reservation
from accounts.permissions import IsLibrarianOrAdmin
from django.db.models import F
from django.shortcuts import get_object_or_404
import datetime
from lending.models import LendingRecord
class BookRequestViewSet(viewsets.ModelViewSet):
    queryset = BookRequest.objects.all()
    serializer_class = BookRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['librarian', 'admin']:
            return BookRequest.objects.all()
        return BookRequest.objects.filter(member=user)

    def create(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        member = request.user

        try:
            book = Book.objects.get(id=book_id)

            if book.available_copies > 0:
                book_request = BookRequest.objects.create(book=book, member=member, status='lending')
            else:
                last_position = Reservation.objects.filter(book=book).count()
                Reservation.objects.create(book=book, member=member, position=last_position + 1)
                book_request = BookRequest.objects.create(book=book, member=member, status='reserved')

            serializer = self.get_serializer(book_request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='fulfill')
    def fulfill_request(self, request, pk=None):
        if not request.user.role in ['librarian', 'admin']:
            return Response({'error': 'You do not have permission to fulfill requests.'}, status=status.HTTP_403_FORBIDDEN)
            
        book_request = self.get_object()
        
        if book_request.book.available_copies > 0:

            due_date = datetime.datetime.now() + datetime.timedelta(days=14)
            LendingRecord.objects.create(
                member=book_request.member,
                book=book_request.book,
                due_date=due_date
            )

            book_request.status = 'fulfilled'
            book_request.is_active = False

            book_request.book.available_copies -= 1
            book_request.book.save()
            book_request.save()
            
            return Response({'message': 'Request fulfilled and book is now being lent.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Book is not available to be lent.'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_request(self, request, pk=None):
        book_request = get_object_or_404(BookRequest, pk=pk)

        if request.user != book_request.member and not IsLibrarianOrAdmin().has_permission(request, self):
            return Response({'error': 'You do not have permission to cancel this request.'}, status=status.HTTP_403_FORBIDDEN)

        if not book_request.is_active:
            return Response({'error': 'This request is already inactive.'}, status=status.HTTP_400_BAD_REQUEST)


        book_request.status = 'denied'
        book_request.is_active = False
        book_request.save()


        if book_request.status == 'reserved':
            try:
                reservation = Reservation.objects.get(book=book_request.book, member=book_request.member)
                reservation_position = reservation.position
                reservation.delete()

                Reservation.objects.filter(book=book_request.book, position__gt=reservation_position).update(position=F('position') - 1)
            except Reservation.DoesNotExist:
                pass 

        return Response({'message': 'Book request cancelled successfully.'}, status=status.HTTP_200_OK)