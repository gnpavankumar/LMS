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
    
class IsUserOrLibrarianOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow a user to see their own profile,
    while also allowing librarians and admins to see any profile.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'librarian']:
            return True
        return obj == request.user