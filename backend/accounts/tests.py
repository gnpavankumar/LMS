
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import User

# Get the custom user model
User = get_user_model()
print(User)
class RegistrationTests(APITestCase):
    def test_user_registration(self):
        """
        Ensure we can register a new user successfully.
        """
        url = reverse('auth-register')
        data = {'username': 'testuser', 'password': 'testpassword', 'name': 'Test User'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')