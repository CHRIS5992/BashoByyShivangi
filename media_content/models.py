from django.db import models


class GalleryImage(models.Model):
    """Photo gallery with categorized images"""
    CATEGORY_CHOICES = [
        ('product', 'Product Gallery'),
        ('workshop', 'Workshop Moments'),
        ('studio', 'Studio & Events'),
    ]
    
    image = models.ImageField(upload_to='media/gallery/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    caption = models.CharField(max_length=200, blank=True, help_text="Admin-only caption")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
    
    def __str__(self):
        return f"{self.get_category_display()} - {self.caption or f'Image {self.id}'}"


class TextTestimonial(models.Model):
    """Text-based customer testimonials"""
    customer_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    quote = models.TextField(help_text="The testimonial text")
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']
        verbose_name = "Text Testimonial"
        verbose_name_plural = "Text Testimonials"
    
    def __str__(self):
        return f"{self.customer_name} - {self.quote[:50]}..."


class VideoTestimonial(models.Model):
    """Video-based customer testimonials"""
    customer_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    description = models.TextField(max_length=300, help_text="Short description of the video")
    video_file = models.FileField(upload_to='media/videos/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube or Vimeo embed URL")
    thumbnail = models.ImageField(upload_to='media/thumbnails/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = "Video Testimonial"
        verbose_name_plural = "Video Testimonials"
    
    def __str__(self):
        return f"Video: {self.customer_name}"


class CustomerExperience(models.Model):
    """Journal-style customer experience entries"""
    image = models.ImageField(upload_to='media/experiences/')
    paragraph = models.TextField(help_text="Short narrative paragraph")
    customer_name = models.CharField(max_length=100, blank=True)
    context = models.CharField(max_length=200, blank=True, help_text="Optional context (e.g., 'Weekend workshop attendee')")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Customer Experience"
        verbose_name_plural = "Customer Experiences"
    
    def __str__(self):
        return f"{self.customer_name or 'Anonymous'} - {self.paragraph[:40]}..."
