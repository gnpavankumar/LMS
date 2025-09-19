from django.db import models
from accounts.models import User
from books.models import Book

class BookRequest(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('lending', 'Lending in progress'),
            ('reserved', 'Reserved'),
            ('fulfilled', 'Request Fulfilled'),
            ('denied', 'Denied'),
        ],
        default='pending'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.member.username} requested {self.book.title}"

    class Meta:
        ordering = ['request_date']