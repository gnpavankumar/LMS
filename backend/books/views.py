from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer
from accounts.permissions import IsLibrarianOrAdmin
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
import csv
import io
from django.db.models import F

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'language', 'publication_year']
    search_fields = ['title', 'author', 'isbn']

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'search']:
            permission_classes = [IsAuthenticated]
        else:
            
            permission_classes = [IsAuthenticated, IsLibrarianOrAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def bulk_upload(self, request):
        """
        Bulk upload book data via a CSV file.
        """
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file_obj.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            books_to_create = []
            for row in reader:
                books_to_create.append(Book(
                    title=row['title'],
                    author=row['author'],
                    isbn=row['isbn'],
                    category=row.get('category'),
                    language=row.get('language'),
                    publication_year=row.get('publication_year'),
                    total_copies=row.get('total_copies', 1),
                    available_copies=row.get('available_copies', 1),
                    description=row.get('description'),
                    cover_image_url=row.get('cover_image_url')
                ))
            
            Book.objects.bulk_create(books_to_create)
            return Response({'message': f'{len(books_to_create)} books successfully uploaded.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        
        total_copies = serializer.validated_data.get('total_copies', 1)
        serializer.validated_data['available_copies'] = total_copies
        serializer.save()

    def perform_update(self, serializer):
        old_total_copies = self.get_object().total_copies
        new_total_copies = serializer.validated_data.get('total_copies', old_total_copies)
        
        diff = new_total_copies - old_total_copies
        if diff > 0:
            serializer.validated_data['available_copies'] = F('available_copies') + diff
        
        serializer.save()