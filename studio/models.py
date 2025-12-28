from django.db import models


class UpcomingExhibition(models.Model):
    """Model for upcoming pop-ups and exhibitions"""
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(max_length=500, help_text="Short description (max 500 chars)")
    image = models.ImageField(upload_to='studio/exhibitions/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_date']
        verbose_name = "Upcoming Exhibition"
        verbose_name_plural = "Upcoming Exhibitions"
    
    def __str__(self):
        return f"{self.title} - {self.location}"


class PastPopup(models.Model):
    """Model for past pop-up showcases"""
    event_name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    year = models.IntegerField()
    image = models.ImageField(upload_to='studio/past-popups/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-year', 'event_name']
        verbose_name = "Past Pop-up"
        verbose_name_plural = "Past Pop-ups"
    
    def __str__(self):
        return f"{self.event_name} ({self.city}, {self.year})"


class EventGalleryImage(models.Model):
    """Model for event gallery images"""
    image = models.ImageField(upload_to='studio/gallery/')
    alt_text = models.CharField(max_length=200, blank=True, help_text="Optional alt text for accessibility")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Event Gallery Image"
        verbose_name_plural = "Event Gallery Images"
    
    def __str__(self):
        return self.alt_text or f"Gallery Image {self.id}"
