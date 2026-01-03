from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extended user profile for Firebase authenticated users
    Links Firebase UID to Django user system
    """
    # Link to Django's built-in User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True, blank=True)
    
    # Firebase UID (unique identifier from Firebase)
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    
    # User Information
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=200, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Profile Picture
    photo_url = models.URLField(blank=True)
    
    # Additional Info
    is_email_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.display_name or self.email}"
    
    def get_order_count(self):
        """Returns total number of orders placed by this user"""
        return self.orders.count()
    
    def get_total_spent(self):
        """Returns total amount spent by this user"""
        from django.db.models import Sum
        total = self.orders.filter(payment_status=True).aggregate(Sum('total_amount'))['total_amount__sum']
        return total or 0
