from django.contrib import admin
from .models import Creation


@admin.register(Creation)
class CreationAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Creations Gallery.
    Allows easy upload and management of masonry gallery images.
    """
    list_display = ['id', 'order', 'height', 'is_active', 'created_at', 'image_preview']
    list_editable = ['order', 'height', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['alt_text', 'url']
    ordering = ['order', '-created_at']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Image', {
            'fields': ('image', 'image_preview_large', 'alt_text')
        }),
        ('Link', {
            'fields': ('url',),
            'classes': ('collapse',)
        }),
        ('Layout', {
            'fields': ('height', 'order', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="height: 50px; border-radius: 4px;" />'
        return '-'
    image_preview.short_description = 'Preview'
    image_preview.allow_tags = True

    def image_preview_large(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 200px; border-radius: 8px;" />'
        return 'No image uploaded'
    image_preview_large.short_description = 'Current Image'
    image_preview_large.allow_tags = True
