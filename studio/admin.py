from django.contrib import admin
from django.utils.html import format_html
from .models import UpcomingExhibition, PastPopup, EventGalleryImage


# ====================
# UPCOMING EXHIBITIONS ADMIN
# ====================
@admin.register(UpcomingExhibition)
class UpcomingExhibitionAdmin(admin.ModelAdmin):
    """
    Manage upcoming pop-ups and exhibitions
    Add events where Basho will be showcased
    """
    
    list_display = [
        'image_preview',
        'title',
        'location',
        'date_range',
        'status_display',
        'is_active'
    ]
    
    list_filter = ['is_active', 'start_date', 'end_date']
    
    search_fields = ['title', 'location', 'description']
    
    list_editable = ['is_active']
    
    date_hierarchy = 'start_date'
    
    readonly_fields = ['created_at', 'updated_at', 'image_preview_large']
    
    list_per_page = 20
    
    fieldsets = (
        ('📋 Event Information', {
            'fields': ('title', 'location', 'description'),
            'description': 'Basic details about the exhibition or pop-up'
        }),
        ('📅 Event Dates', {
            'fields': ('start_date', 'end_date'),
            'description': 'When the event takes place'
        }),
        ('🖼️ Event Image', {
            'fields': ('image_preview_large', 'image'),
            'description': 'Cover image for the event'
        }),
        ('👁️ Visibility', {
            'fields': ('is_active',),
            'description': 'Show this event on the website'
        }),
        ('🕒 Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Small image preview in list"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return format_html('<span style="color: #999;">{}</span>', 'No image')
    image_preview.short_description = 'Image'
    
    def image_preview_large(self, obj):
        """Large preview in form"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.image.url
            )
        return 'No image uploaded'
    image_preview_large.short_description = 'Current Image'
    
    def date_range(self, obj):
        """Show date range formatted"""
        if obj.start_date == obj.end_date:
            return obj.start_date.strftime('%b %d, %Y')
        return format_html(
            '<span style="font-size: 12px;">{} <strong>→</strong> {}</span>',
            obj.start_date.strftime('%b %d'),
            obj.end_date.strftime('%b %d, %Y')
        )
    date_range.short_description = 'Dates'
    
    def status_display(self, obj):
        """Show if event is upcoming, ongoing, or past"""
        from datetime import date
        today = date.today()
        
        if obj.start_date > today:
            days_until = (obj.start_date - today).days
            return format_html(
                '<span style="background: #E3F2FD; color: #1976D2; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">📅 In {} days</span>',
                days_until
            )
        elif obj.start_date <= today <= obj.end_date:
            return format_html(
                '<span style="background: #E8F5E9; color: #388E3C; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">{}</span>',
                '🔴 LIVE NOW'
            )
        else:
            return format_html(
                '<span style="background: #F5F5F5; color: #757575; padding: 4px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
                '✓ Completed'
            )
    status_display.short_description = 'Status'
    
    actions = ['activate_events', 'deactivate_events']
    
    def activate_events(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} event(s) activated and visible on website')
    activate_events.short_description = "✅ Show on website"
    
    def deactivate_events(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} event(s) hidden from website')
    deactivate_events.short_description = "❌ Hide from website"


# ====================
# PAST POPUPS ADMIN
# ====================
@admin.register(PastPopup)
class PastPopupAdmin(admin.ModelAdmin):
    """
    Archive of past pop-up events
    Keep a record of where Basho has been featured
    """
    
    list_display = [
        'image_preview',
        'event_name', 
        'city',
        'year',
        'created_at'
    ]
    
    list_filter = ['year', 'city']
    
    search_fields = ['event_name', 'city']
    
    ordering = ['-year', 'event_name']
    
    readonly_fields = ['created_at', 'image_preview_large']
    
    list_per_page = 30
    
    fieldsets = (
        ('📍 Event Details', {
            'fields': ('event_name', 'city', 'year'),
            'description': 'Details about the past pop-up'
        }),
        ('🖼️ Event Photo', {
            'fields': ('image_preview_large', 'image'),
            'description': 'Photo from the event'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Small image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return format_html('<span style="color: #999;">{}</span>', 'No image')
    image_preview.short_description = 'Photo'
    
    def image_preview_large(self, obj):
        """Large preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.image.url
            )
        return 'No image uploaded'
    image_preview_large.short_description = 'Current Photo'


# ====================
# EVENT GALLERY ADMIN
# ====================
@admin.register(EventGalleryImage)
class EventGalleryImageAdmin(admin.ModelAdmin):
    """
    Manage event gallery images
    Photos from studio events and workshops
    """
    
    list_display = [
        'image_preview',
        'alt_text_display',
        'order',
        'created_at'
    ]
    
    list_editable = ['order']
    
    search_fields = ['alt_text']
    
    ordering = ['order', '-created_at']
    
    readonly_fields = ['created_at', 'image_preview_large']
    
    list_per_page = 30
    
    fieldsets = (
        ('🖼️ Image Upload', {
            'fields': ('image_preview_large', 'image'),
            'description': 'Upload event photos'
        }),
        ('📝 Image Details', {
            'fields': ('alt_text', 'order'),
            'description': 'Description and display order (lower numbers appear first)'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Thumbnail preview"""
        return format_html(
            '<img src="{}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />',
            obj.image.url
        )
    image_preview.short_description = 'Preview'
    
    def image_preview_large(self, obj):
        """Large preview"""
        return format_html(
            '<img src="{}" style="max-width: 500px; max-height: 500px; border-radius: 8px;" />',
            obj.image.url
        )
    image_preview_large.short_description = 'Current Image'
    
    def alt_text_display(self, obj):
        """Show alt text or default"""
        if obj.alt_text:
            return obj.alt_text
        return format_html('<em style="color: #999;">Gallery Image #{}</em>', obj.id)
    alt_text_display.short_description = 'Description'
