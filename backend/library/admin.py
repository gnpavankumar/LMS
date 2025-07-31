from django.contrib import admin
from .models import User , Reservation, Book, LendingRecord

# Register your models here.
admin.site.register(User)
admin.site.register(Reservation)
admin.site.register(Book)
admin.site.register(LendingRecord)
