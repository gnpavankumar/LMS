from rest_framework import permissions

class IsLibrarianOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow only 'Librarian' or 'Admin' users access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['librarian', 'admin']

class IsMember(permissions.BasePermission):
    """
    Custom permission to allow only 'Member' users access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'member'

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to allow only 'Admin' users access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'