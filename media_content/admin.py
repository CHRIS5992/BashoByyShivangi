from django.contrib import admin
from django.utils.html import format_html
from .models import GalleryImage, TextTestimonial, VideoTestimonial, CustomerExperience


# ====================
# GALLERY IMAGE ADMIN
# ====================
@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    """
    Manage gallery images
    Organize photos by category (products, workshops, studio)
    """
    
    list_display = [
        'image_preview',
        'caption_display',
        'category_badge',
        'order',
        'is_active',
        'created_at'
    ]
    
    list_filter = ['category', 'is_active', 'created_at']
    
    list_editable = ['order', 'is_active']
    
    search_fields = ['caption']
    
    ordering = ['category', 'order', '-created_at']
    
    readonly_fields = ['created_at', 'image_preview_large']
    
    list_per_page = 30
    
    fieldsets = (
        ('🖼️ Image Upload', {
            'fields': ('image_preview_large', 'image'),
            'description': 'Upload the gallery image'
        }),
        ('📋 Image Information', {
            'fields': ('category', 'caption'),
            'description': 'Categorize and describe the image'
        }),
        ('⚙️ Display Settings', {
            'fields': ('order', 'is_active'),
            'description': 'Control display order and visibility'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Small thumbnail in list"""
        return format_html(
            '<img src="{}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />',
            obj.image.url
        )
    image_preview.short_description = 'Preview'
    
    def image_preview_large(self, obj):
        """Large preview in form"""
        return format_html(
            '<img src="{}" style="max-width: 500px; max-height: 500px; border-radius: 8px;" />',
            obj.image.url
        )
    image_preview_large.short_description = 'Current Image'
    
    def caption_display(self, obj):
        """Show caption or default text"""
        if obj.caption:
            return obj.caption
        return format_html('<em style="color: #999;">Image #{}</em>', obj.id)
    caption_display.short_description = 'Caption'
    
    def category_badge(self, obj):
        """Show category with color"""
        colors = {
            'product': '#4CAF50',
            'workshop': '#FF9800',
            'studio': '#2196F3',
        }
        color = colors.get(obj.category, '#757575')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 500;">{}</span>',
            color, obj.get_category_display()
        )
    category_badge.short_description = 'Category'
    
    actions = ['activate_images', 'deactivate_images']
    
    def activate_images(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} image(s) activated')
    activate_images.short_description = "✅ Show on website"
    
    def deactivate_images(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} image(s) hidden')
    deactivate_images.short_description = "❌ Hide from website"


# ====================
# TEXT TESTIMONIAL ADMIN
# ====================
@admin.register(TextTestimonial)
class TextTestimonialAdmin(admin.ModelAdmin):
    """
    Manage customer testimonials (text)
    Add reviews and feedback from customers
    """
    
    list_display = [
        'customer_name',
        'location',
        'quote_preview',
        'is_featured',
        'order',
        'is_active'
    ]
    
    list_filter = ['is_featured', 'is_active', 'created_at']
    
    list_editable = ['is_featured', 'order', 'is_active']
    
    search_fields = ['customer_name', 'quote', 'location']
    
    ordering = ['-is_featured', 'order', '-created_at']
    
    readonly_fields = ['created_at']
    
    list_per_page = 25
    
    fieldsets = (
        ('👤 Customer Information', {
            'fields': ('customer_name', 'location'),
            'description': 'Who gave this testimonial'
        }),
        ('💬 Testimonial', {
            'fields': ('quote',),
            'description': 'What the customer said'
        }),
        ('⭐ Display Settings', {
            'fields': ('is_featured', 'is_active', 'order'),
            'description': 'Featured testimonials appear more prominently'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def quote_preview(self, obj):
        """Show truncated quote"""
        if len(obj.quote) > 80:
            return format_html('<em>{} ...</em>', obj.quote[:80])
        return format_html('<em>{}</em>', obj.quote)
    quote_preview.short_description = 'Testimonial'
    
    def featured_status(self, obj):
        """Show if featured"""
        if obj.is_featured:
            return format_html('<span style="color: #FF9800;">⭐ Featured</span>')
        return '-'
    featured_status.short_description = 'Status'
    
    actions = ['mark_featured', 'unmark_featured', 'activate_testimonials', 'deactivate_testimonials']
    
    def mark_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'⭐ {updated} testimonial(s) marked as featured')
    mark_featured.short_description = "⭐ Mark as FEATURED"
    
    def unmark_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'Removed {updated} testimonial(s) from featured')
    unmark_featured.short_description = "Remove from FEATURED"
    
    def activate_testimonials(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} testimonial(s) activated')
    activate_testimonials.short_description = "✅ Activate"
    
    def deactivate_testimonials(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} testimonial(s) deactivated')
    deactivate_testimonials.short_description = "❌ Deactivate"


# ====================
# VIDEO TESTIMONIAL ADMIN
# ====================
@admin.register(VideoTestimonial)
class VideoTestimonialAdmin(admin.ModelAdmin):
    """
    Manage video testimonials
    Upload videos or provide YouTube/Vimeo links
    """
    
    list_display = [
        'thumbnail_preview',
        'customer_name',
        'location',
        'video_type',
        'is_featured',
        'is_active'
    ]
    
    list_filter = ['is_featured', 'is_active', 'created_at']
    
    list_editable = ['is_featured', 'is_active']
    
    search_fields = ['customer_name', 'description', 'location']
    
    ordering = ['-is_featured', '-created_at']
    
    readonly_fields = ['created_at', 'thumbnail_preview_large']
    
    list_per_page = 20
    
    fieldsets = (
        ('👤 Customer Information', {
            'fields': ('customer_name', 'location', 'description'),
            'description': 'Who gave this video testimonial'
        }),
        ('🎥 Video', {
            'fields': ('video_file', 'video_url'),
            'description': 'Upload a video file OR provide a YouTube/Vimeo embed URL (not both)'
        }),
        ('🖼️ Thumbnail', {
            'fields': ('thumbnail_preview_large', 'thumbnail'),
            'description': 'Optional thumbnail image for the video'
        }),
        ('⭐ Settings', {
            'fields': ('is_featured', 'is_active'),
            'description': 'Control visibility and promotion'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def thumbnail_preview(self, obj):
        """Small thumbnail preview"""
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;" />',
                obj.thumbnail.url
            )
        return format_html('<span style="color: #999;">{}</span>', '🎥 No thumbnail')
    thumbnail_preview.short_description = 'Thumbnail'
    
    def thumbnail_preview_large(self, obj):
        """Large thumbnail preview"""
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 300px; border-radius: 8px;" />',
                obj.thumbnail.url
            )
        return 'No thumbnail uploaded'
    thumbnail_preview_large.short_description = 'Current Thumbnail'
    
    def video_type(self, obj):
        """Show if video is uploaded or linked"""
        if obj.video_file:
            return format_html('<span style="color: #4CAF50;">{}</span>', '📁 Uploaded')
        elif obj.video_url:
            return format_html('<span style="color: #2196F3;">{}</span>', '🔗 External Link')
        return format_html('<span style="color: #F44336;">{}</span>', '❌ No video')
    video_type.short_description = 'Video Source'
    
    def featured_status(self, obj):
        """Show if featured"""
        if obj.is_featured:
            return format_html('<span style="color: #FF9800;">{}</span>', '⭐ Featured')
        return '-'
    featured_status.short_description = 'Status'
    
    actions = ['mark_featured', 'unmark_featured', 'activate_videos', 'deactivate_videos']
    
    actions = ['mark_featured', 'unmark_featured', 'activate_videos', 'deactivate_videos']
    
    def mark_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'⭐ {updated} video(s) marked as featured')
    mark_featured.short_description = "⭐ Mark as FEATURED"
    
    def unmark_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'Removed {updated} video(s) from featured')
    unmark_featured.short_description = "Remove from FEATURED"
    
    def activate_videos(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} video(s) activated')
    activate_videos.short_description = "✅ Activate"
    
    def deactivate_videos(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} video(s) deactivated')
    deactivate_videos.short_description = "❌ Deactivate"


# ====================
# CUSTOMER EXPERIENCE ADMIN
# ====================
@admin.register(CustomerExperience)
class CustomerExperienceAdmin(admin.ModelAdmin):
    """
    Manage customer experience stories
    Journal-style entries with images and narratives
    """
    
    list_display = [
        'image_preview',
        'customer_name',
        'context',
        'paragraph_preview',
        'order',
        'is_active'
    ]
    
    list_filter = ['is_active', 'created_at']
    
    list_editable = ['order', 'is_active']
    
    search_fields = ['customer_name', 'paragraph', 'context']
    
    ordering = ['order', '-created_at']
    
    readonly_fields = ['created_at', 'image_preview_large']
    
    list_per_page = 25
    
    fieldsets = (
        ('👤 Customer Information', {
            'fields': ('customer_name', 'context'),
            'description': 'Who is sharing this experience (optional)'
        }),
        ('📝 Experience Story', {
            'fields': ('paragraph',),
            'description': 'The customer\'s story or experience'
        }),
        ('🖼️ Image', {
            'fields': ('image_preview_large', 'image'),
            'description': 'Photo accompanying the story'
        }),
        ('⚙️ Display Settings', {
            'fields': ('order', 'is_active'),
            'description': 'Control order and visibility'
        }),
        ('🕒 Added On', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Small image preview"""
        return format_html(
            '<img src="{}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />',
            obj.image.url
        )
    image_preview.short_description = 'Photo'
    
    def image_preview_large(self, obj):
        """Large image preview"""
        return format_html(
            '<img src="{}" style="max-width: 500px; max-height: 500px; border-radius: 8px;" />',
            obj.image.url
        )
    image_preview_large.short_description = 'Current Image'
    
    def paragraph_preview(self, obj):
        """Show truncated paragraph"""
        if len(obj.paragraph) > 60:
            return format_html('<em>{} ...</em>', obj.paragraph[:60])
        return format_html('<em>{}</em>', obj.paragraph)
    paragraph_preview.short_description = 'Story'
    
    actions = ['activate_experiences', 'deactivate_experiences']
    
    def activate_experiences(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} experience(s) activated')
    activate_experiences.short_description = "✅ Activate"
    
    def deactivate_experiences(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} experience(s) deactivated')
    deactivate_experiences.short_description = "❌ Deactivate"
