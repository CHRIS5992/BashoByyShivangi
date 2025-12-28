from django.contrib import admin
from .models import GalleryImage, TextTestimonial, VideoTestimonial, CustomerExperience


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'category', 'order', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['caption']
    ordering = ['order', '-created_at']
    
    fieldsets = (
        (None, {
            'fields': ('image', 'category', 'caption')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(TextTestimonial)
class TextTestimonialAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'location', 'is_featured', 'is_active', 'order']
    list_filter = ['is_featured', 'is_active']
    list_editable = ['is_featured', 'is_active', 'order']
    search_fields = ['customer_name', 'quote']
    ordering = ['-is_featured', 'order']


@admin.register(VideoTestimonial)
class VideoTestimonialAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'location', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active']
    list_editable = ['is_featured', 'is_active']
    search_fields = ['customer_name', 'description']
    
    fieldsets = (
        ('Customer Info', {
            'fields': ('customer_name', 'location', 'description')
        }),
        ('Video', {
            'fields': ('video_file', 'video_url', 'thumbnail'),
            'description': 'Upload a video file OR provide an embed URL'
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_active')
        }),
    )


@admin.register(CustomerExperience)
class CustomerExperienceAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'context', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['customer_name', 'paragraph', 'context']
    ordering = ['order', '-created_at']
