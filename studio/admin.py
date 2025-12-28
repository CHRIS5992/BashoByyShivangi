from django.contrib import admin
from .models import UpcomingExhibition, PastPopup, EventGalleryImage


@admin.register(UpcomingExhibition)
class UpcomingExhibitionAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'start_date']
    search_fields = ['title', 'location', 'description']
    list_editable = ['is_active']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'location', 'description')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(PastPopup)
class PastPopupAdmin(admin.ModelAdmin):
    list_display = ['event_name', 'city', 'year']
    list_filter = ['year', 'city']
    search_fields = ['event_name', 'city']
    ordering = ['-year', 'event_name']


@admin.register(EventGalleryImage)
class EventGalleryImageAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'order', 'created_at']
    list_editable = ['order']
    ordering = ['order', '-created_at']
