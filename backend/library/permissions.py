from rest_framework import permissions

class IsLibrarianOrAdmin(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['librarian', 'admin']

class IsMember(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'member'

class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'