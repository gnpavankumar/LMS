from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name=models.CharField(max_length=50)
    roleChoice=[('admin','Admin'),('librarian','Librarian'),('member','Member')]
    role=models.CharField(max_length=30,choices=roleChoice,default='member')
    phone=models.IntegerField(unique=True)

    def __str__(self):
        return self.username

        