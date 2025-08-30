from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path
router=DefaultRouter()
router.register("books",views.booksView)
urlpatterns = [
    path("",views.BookListCreateAPIView.as_view()),


]+router.urls