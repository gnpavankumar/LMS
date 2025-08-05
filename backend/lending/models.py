from django.db import models
from accounts.models import User
from books.models import Book
class LendingRecord(models.Model):
    member=models.ForeignKey(User,on_delete=models.CASCADE,related_name="borrowed_books")
    book=models.ForeignKey(Book,on_delete=models.CASCADE,related_name='lending_records')
    issued_on=models.DateTimeField(auto_now_add=True)
    due_date=models.DateTimeField()
    return_date=models.DateTimeField(blank=True,null=True)
    fine_amount=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    is_overdue=models.BooleanField(default=False)
    def __str__(self):
        return f"{self.member.username} borrowed {self.book.title}(Due:{self.due_date})"
    class Meta:
        ordering=['-issued_on']
