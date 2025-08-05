from django.db import models
from accounts.models import User
from books.models import Book
class Reservation(models.Model):
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations')
    reservation_date = models.DateTimeField(auto_now_add=True, help_text="Date the reservation was placed")
    position = models.IntegerField(default=0)

    def _str_(self):
        return f"{self.member.username} reserved {self.book.title} (Pos: {self.position})"

    class Meta:
        ordering = ['book', 'position', 'reservation_date']
        unique_together = ('member', 'book')
