from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import Reservation
from .serializers import ReservationSerializer
from books.models import Book
from accounts.permissions import IsLibrarianOrAdmin

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['librarian', 'admin']:
            return Reservation.objects.all()
        return Reservation.objects.filter(member=user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'reserve_book', 'cancel_reservation']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsLibrarianOrAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], url_path='reserve')
    def reserve_book(self, request):
        book_id = request.data.get('book_id')
        member = request.user
        
        try:
            book = Book.objects.get(id=book_id)
            
            # Check if book is available
            if book.available_copies > 0:
                return Response({'error': 'This book is currently available and does not need to be reserved.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for an existing reservation by the same member for the same book
            if Reservation.objects.filter(book=book, member=member).exists():
                return Response({'error': 'You already have a reservation for this book.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Determine the waitlist position
            last_position = Reservation.objects.filter(book=book).count()
            
            # Create the reservation
            reservation = Reservation.objects.create(book=book, member=member, position=last_position + 1)
            
            serializer = self.get_serializer(reservation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_reservation(self, request, pk=None):
        reservation = get_object_or_404(Reservation, pk=pk)
        
        # Permission check: A user can cancel their own reservation, or a librarian/admin can cancel any
        if request.user != reservation.member and request.user.role not in ['librarian', 'admin']:
            return Response({'error': 'You do not have permission to cancel this reservation.'}, status=status.HTTP_403_FORBIDDEN)
        
        book = reservation.book
        reservation_position = reservation.position
        
        # Delete the reservation
        reservation.delete()
        
        # Update the positions of all other reservations for that book
        Reservation.objects.filter(book=book, position__gt=reservation_position).update(position=F('position') - 1)
        
        return Response({'message': 'Reservation cancelled successfully.'}, status=status.HTTP_200_OK)