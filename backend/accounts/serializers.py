from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=False) # Make password not required for updates
    
    class Meta:
        model=User
        fields=['id','username','password','name','phone','role','email']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        request = self.context.get('request')
        password = validated_data.pop('password', None)
        
        # Only allow admins to change a user's role
        if not (request and request.user.role == 'admin'):
            validated_data.pop('role', None)

        for attr, value in validated_data.items(): # Added parentheses here
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'phone', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True}
        }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.role = 'member'  
        user.save()
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role 
        return token
