from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Workshop(models.Model):
    """Model for pottery workshops"""
    WORKSHOP_TYPES = [
        ('group', 'Group Workshop'),
        ('one-on-one', 'One-on-One Workshop'),
        ('couple', 'Couple Pottery Date'),
        ('birthday', 'Birthday Celebration'),
        ('party', 'Farm & Garden Mini Party'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('all', 'All Levels'),
    ]
    
    workshop_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    workshop_type = models.CharField(max_length=20, choices=WORKSHOP_TYPES)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='all')
    description = models.TextField()
    short_description = models.CharField(max_length=300)
    duration_hours = models.DecimalField(max_digits=3, decimal_places=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    max_participants = models.IntegerField(validators=[MinValueValidator(1)])
    min_age = models.IntegerField(default=12)
    image = models.ImageField(upload_to='workshops/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text="Alternative: external image URL")
    
    # Availability
    is_active = models.BooleanField(default=True)
    available_slots = models.IntegerField(default=0)
    
    # Features
    includes_materials = models.BooleanField(default=True)
    includes_refreshments = models.BooleanField(default=False)
    takes_home_creation = models.BooleanField(default=True)
    
    # Featured/Popular
    is_featured = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-is_popular', 'name']
    
    def __str__(self):
        return self.name


class WorkshopSlot(models.Model):
    """Model for workshop time slots"""
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    available_spots = models.IntegerField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['date', 'start_time']
        unique_together = ['workshop', 'date', 'start_time']
    
    def __str__(self):
        return f"{self.workshop.name} - {self.date} {self.start_time}"


class WorkshopRegistration(models.Model):
    """Model for workshop registrations"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, related_name='registrations')
    slot = models.ForeignKey(WorkshopSlot, on_delete=models.CASCADE, related_name='registrations', null=True, blank=True)
    
    # User Association (Optional - null if guest registration)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, 
                            null=True, blank=True, related_name='workshop_registrations',
                            help_text="Linked user if logged in during registration")
    
    # Registration Number
    registration_number = models.CharField(max_length=50, unique=True, editable=False, default='WS-TEMP')
    
    # Participant Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    number_of_participants = models.IntegerField(validators=[MinValueValidator(1)])
    
    # Additional Information
    special_requests = models.TextField(blank=True)
    experience_level = models.CharField(max_length=100, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Timestamps
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-registered_at']
        verbose_name = 'Workshop Registration'
        verbose_name_plural = 'Workshops - Registrations (Purchases)'
    
    def __str__(self):
        return f"{self.registration_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        # Auto-generate registration number
        if not self.registration_number:
            from datetime import datetime
            self.registration_number = f"WS-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Calculate total amount
        if not self.total_amount:
            self.total_amount = self.workshop.price * self.number_of_participants
        super().save(*args, **kwargs)
