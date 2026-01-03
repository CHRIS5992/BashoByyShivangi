from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Workshop, WorkshopSlot, WorkshopRegistration


# ====================
# WORKSHOP ADMIN
# ====================
@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    """
    User-friendly workshop management
    Add and manage all workshop types
    """
    
    list_display = [
        'image_preview',
        'name', 
        'type_badge',
        'difficulty_badge',
        'duration_display',
        'price_display', 
        'capacity_display',
        'available_slots',
        'is_featured',
        'is_popular',
        'is_active',
    ]
    
    list_filter = [
        'workshop_type', 
        'difficulty_level', 
        'is_featured', 
        'is_popular', 
        'is_active',
        'includes_materials',
        'includes_refreshments',
    ]
    
    search_fields = ['name', 'description', 'workshop_id', 'short_description']
    
    list_editable = ['available_slots', 'is_featured', 'is_popular', 'is_active']
    
    readonly_fields = ['created_at', 'updated_at', 'image_preview_large', 'registration_stats']
    
    list_per_page = 20
    
    prepopulated_fields = {'workshop_id': ('name',)}
    
    fieldsets = (
        ('📋 Workshop Details', {
            'fields': ('workshop_id', 'name', 'workshop_type', 'difficulty_level'),
            'description': 'Basic workshop information'
        }),
        ('📝 Description', {
            'fields': ('short_description', 'description'),
            'description': 'What participants will learn and experience'
        }),
        ('⏱️ Duration & Pricing', {
            'fields': ('duration_hours', 'price', 'min_age'),
            'description': 'Workshop duration and cost'
        }),
        ('👥 Capacity', {
            'fields': ('max_participants', 'available_slots'),
            'description': 'Maximum participants and available slots'
        }),
        ('✨ What\'s Included', {
            'fields': ('includes_materials', 'includes_refreshments', 'takes_home_creation'),
            'description': 'What participants get'
        }),
        ('⭐ Visibility Settings', {
            'fields': ('is_featured', 'is_popular', 'is_active'),
            'description': 'Display on website and availability'
        }),
        ('🖼️ Image', {
            'fields': ('image_preview_large', 'image', 'image_url'),
            'description': 'Workshop cover image'
        }),
        ('📊 Statistics', {
            'fields': ('registration_stats',),
            'classes': ('collapse',)
        }),
        ('🕒 Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Custom display methods
    def image_preview(self, obj):
        """Small image preview"""
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.image_url)
        return format_html('<span style="color: #999;">{}</span>', 'No image')
    image_preview.short_description = 'Image'
    
    def image_preview_large(self, obj):
        """Large preview in form"""
        if obj.image:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" />', obj.image_url)
        return 'No image uploaded'
    image_preview_large.short_description = 'Current Image'
    
    def type_badge(self, obj):
        """Show workshop type with color"""
        colors = {
            'group': '#4CAF50',
            'one-on-one': '#2196F3',
            'couple': '#E91E63',
            'birthday': '#FF9800',
            'party': '#9C27B0',
        }
        color = colors.get(obj.workshop_type, '#757575')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">{}</span>',
            color, obj.get_workshop_type_display()
        )
    type_badge.short_description = 'Type'
    
    def difficulty_badge(self, obj):
        """Show difficulty level"""
        colors = {
            'beginner': '#4CAF50',
            'intermediate': '#FF9800',
            'advanced': '#F44336',
            'all': '#2196F3',
        }
        color = colors.get(obj.difficulty_level, '#757575')
        return format_html(
            '<span style="border: 2px solid {}; color: {}; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">{}</span>',
            color, color, obj.get_difficulty_level_display()
        )
    difficulty_badge.short_description = 'Level'
    
    def duration_display(self, obj):
        """Show duration in hours"""
        return f'{obj.duration_hours} hrs'
    duration_display.short_description = 'Duration'
    duration_display.admin_order_field = 'duration_hours'
    
    def price_display(self, obj):
        """Show price formatted"""
        return format_html('<strong>₹{}</strong>', f'{obj.price:,.2f}')
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'
    
    def capacity_display(self, obj):
        """Show max participants"""
        return f'Max {obj.max_participants}'
    capacity_display.short_description = 'Capacity'
    
    def slots_available(self, obj):
        """Show available slots with status"""
        if obj.available_slots > 0:
            return format_html('<span style="color: #4CAF50; font-weight: 600;">{} slots</span>', obj.available_slots)
        return format_html('<span style="color: #F44336; font-weight: 600;">{}</span>', 'Fully Booked')
    slots_available.short_description = 'Availability'
    
    def featured_popular(self, obj):
        """Show if featured or popular"""
        badges = []
        if obj.is_featured:
            badges.append('⭐ Featured')
        if obj.is_popular:
            badges.append('🔥 Popular')
        return ' '.join(badges) if badges else '-'
    featured_popular.short_description = 'Tags'
    
    def registration_stats(self, obj):
        """Show registration statistics"""
        total_registrations = obj.registrations.count()
        confirmed = obj.registrations.filter(status='confirmed').count()
        pending = obj.registrations.filter(status='pending').count()
        
        return format_html(
            '''
            <div style="padding: 15px; background: #f5f5f5; border-radius: 8px;">
                <p><strong>Total Registrations:</strong> {}</p>
                <p><strong>Confirmed:</strong> {} | <strong>Pending:</strong> {}</p>
            </div>
            ''',
            total_registrations, confirmed, pending
        )
    registration_stats.short_description = 'Registration Statistics'
    
    # Bulk actions
    actions = ['activate_workshops', 'deactivate_workshops', 'mark_as_featured', 'unmark_featured']
    
    def activate_workshops(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'✅ {updated} workshop(s) activated')
    activate_workshops.short_description = "✅ Activate selected workshops"
    
    def deactivate_workshops(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'❌ {updated} workshop(s) deactivated')
    deactivate_workshops.short_description = "❌ Deactivate selected workshops"
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'⭐ {updated} workshop(s) marked as featured')
    mark_as_featured.short_description = "⭐ Mark as FEATURED"
    
    def unmark_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'Removed {updated} workshop(s) from featured')
    unmark_featured.short_description = "Remove from FEATURED"


# ====================
# WORKSHOP SLOT ADMIN
# ====================
@admin.register(WorkshopSlot)
class WorkshopSlotAdmin(admin.ModelAdmin):
    """
    Manage workshop time slots
    Schedule when workshops are available
    """
    
    list_display = [
        'workshop',
        'date_display', 
        'time_display',
        'available_spots',
        'availability_status',
        'is_available'
    ]
    
    list_filter = ['workshop', 'date', 'is_available']
    
    list_editable = ['available_spots', 'is_available']
    
    date_hierarchy = 'date'
    
    list_per_page = 30
    
    fieldsets = (
        ('🎯 Workshop', {
            'fields': ('workshop',),
        }),
        ('📅 Schedule', {
            'fields': ('date', 'start_time', 'end_time'),
            'description': 'When this workshop slot occurs'
        }),
        ('👥 Availability', {
            'fields': ('available_spots', 'is_available'),
            'description': 'How many spots are open'
        }),
    )
    
    def date_display(self, obj):
        """Format date nicely"""
        return obj.date.strftime('%B %d, %Y')
    date_display.short_description = 'Date'
    date_display.admin_order_field = 'date'
    
    def time_display(self, obj):
        """Show time range"""
        return format_html(
            '<span style="font-family: monospace;">{} - {}</span>',
            obj.start_time.strftime('%I:%M %p'),
            obj.end_time.strftime('%I:%M %p')
        )
    time_display.short_description = 'Time'
    
    def spots_display(self, obj):
        """Show available spots"""
        return f'{obj.available_spots} spots'
    spots_display.short_description = 'Spots'
    
    def availability_status(self, obj):
        """Visual indicator of availability"""
        if not obj.is_available:
            return format_html('<span style="color: #999; font-weight: 600;">{}</span>', '🔒 Closed')
        elif obj.available_spots == 0:
            return format_html('<span style="color: #F44336; font-weight: 600;">{}</span>', '🔴 Full')
        elif obj.available_spots < 3:
            return format_html('<span style="color: #FF9800; font-weight: 600;">{}</span>', '🟡 Almost Full')
        return format_html('<span style="color: #4CAF50; font-weight: 600;">{}</span>', '🟢 Open')
    availability_status.short_description = 'Status'
    
    actions = ['open_slots', 'close_slots']
    
    def open_slots(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'✅ {updated} slot(s) opened for registration')
    open_slots.short_description = "✅ Open for registration"
    
    def close_slots(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'🔒 {updated} slot(s) closed')
    close_slots.short_description = "🔒 Close slots"


# ====================
# WORKSHOP REGISTRATION ADMIN
# ====================
@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    """
    Manage workshop registrations
    View and process customer bookings
    """
    
    list_display = [
        'participant_info',
        'workshop',
        'slot_info',
        'participants_count',
        'status_badge',
        'amount_display',
        'registered_date',
        'action_required',
    ]
    
    list_filter = ['status', 'workshop', 'registered_at']
    
    search_fields = ['full_name', 'email', 'phone', 'workshop__name']
    
    list_editable = []
    
    readonly_fields = ['registered_at', 'updated_at', 'total_amount']
    
    date_hierarchy = 'registered_at'
    
    list_per_page = 25
    
    fieldsets = (
        ('👤 Participant Information', {
            'fields': ('full_name', 'email', 'phone', 'number_of_participants'),
            'description': 'Who is registering'
        }),
        ('🎯 Workshop Details', {
            'fields': ('workshop', 'slot'),
            'description': 'Which workshop and time slot'
        }),
        ('📝 Additional Information', {
            'fields': ('experience_level', 'special_requests'),
            'description': 'Participant notes and requests'
        }),
        ('💰 Payment & Status', {
            'fields': ('status', 'total_amount'),
            'description': 'Registration status and amount'
        }),
        ('🕒 Timeline', {
            'fields': ('registered_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def participant_info(self, obj):
        """Show participant details"""
        return format_html(
            '<strong>{}</strong><br/><small style="color: #666;">📧 {}<br/>📱 {}</small>',
            obj.full_name, obj.email, obj.phone
        )
    participant_info.short_description = 'Participant'
    
    def slot_info(self, obj):
        """Show slot date and time if available"""
        if obj.slot:
            return format_html(
                '<small>{}<br/>{}</small>',
                obj.slot.date.strftime('%b %d, %Y'),
                obj.slot.start_time.strftime('%I:%M %p')
            )
        return format_html('<em style="color: #999;">{}</em>', 'No slot assigned')
    slot_info.short_description = 'Slot'
    
    def participants_count(self, obj):
        """Show number of participants"""
        return format_html('<strong>{}</strong> participant(s)', obj.number_of_participants)
    participants_count.short_description = 'Count'
    
    def status_badge(self, obj):
        """Show status with color"""
        status_config = {
            'pending': ('🔔 Pending', '#FF9800', '#FFF3E0'),
            'confirmed': ('✅ Confirmed', '#4CAF50', '#E8F5E9'),
            'cancelled': ('❌ Cancelled', '#F44336', '#FFEBEE'),
            'completed': ('🎉 Completed', '#2196F3', '#E3F2FD'),
        }
        config = status_config.get(obj.status, ('Unknown', '#999', '#f5f5f5'))
        label = config[0]
        border_color = config[1]
        bg_color = config[2]
        return format_html(
            '<span style="background: {}; border-left: 3px solid {}; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 110px;">{}</span>',
            bg_color, border_color, label
        )
    status_badge.short_description = 'Status'
    
    def amount_display(self, obj):
        """Show total amount"""
        return format_html('<strong>₹{}</strong>', f'{obj.total_amount:,.2f}')
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'total_amount'
    
    def registered_date(self, obj):
        """Show registration date"""
        return obj.registered_at.strftime('%b %d, %Y')
    registered_date.short_description = 'Registered'
    registered_date.admin_order_field = 'registered_at'
    
    def action_required(self, obj):
        """Show if action needed"""
        if obj.status == 'pending':
            return format_html('<span style="color: #F44336; font-weight: 600;">{}</span>', '⚠️ CONFIRM')
        return '-'
    action_required.short_description = 'Action'
    
    # Bulk actions
    actions = ['confirm_registrations', 'cancel_registrations', 'mark_completed']
    
    def confirm_registrations(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'✅ {updated} registration(s) confirmed')
    confirm_registrations.short_description = "✅ Confirm registrations"
    
    def cancel_registrations(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'❌ {updated} registration(s) cancelled')
    cancel_registrations.short_description = "❌ Cancel registrations"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'🎉 {updated} registration(s) marked as completed')
    mark_completed.short_description = "🎉 Mark as completed"
