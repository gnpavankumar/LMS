from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name=models.CharField(max_length=50)
    roleChoice=[('admin','Admin'),('librarian','Librarian'),('member','Member')]
    role=models.CharField(max_length=30,choices=roleChoice,default='member')
    phone=models.IntegerField(unique=True)

    def __str__(self):
        return self.username
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True)
    cat_choice = [('comedy','Comedy'),('fiction','Fiction'),('education','Education'),('comics','Comics')]
    category = models.CharField(max_length=100,choices=cat_choice, default='education' , blank=True, null=True)
    lang_choice=[('english','English'),('hindi','Hindi'),('kannada','Kannada')]
    language = models.CharField(max_length=50,choices=lang_choice, default='english', blank=True, null=True)
    publication_year = models.IntegerField(blank=True, null=True,)
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)
    description=models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        
        if self.available_copies > self.total_copies:
            self.available_copies = self.total_copies
        
        if not self.pk and self.available_copies is None:
            self.available_copies = self.total_copies
        super().save(*args, **kwargs)

    def _str_(self):
        return f"{self.title} by {self.author} (ISBN: {self.isbn})"
    class Meta:
        ordering = ['title']
    
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