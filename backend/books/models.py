from django.db import models

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
    cover_image_url = models.CharField(max_length=500, blank=True, null=True)

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
