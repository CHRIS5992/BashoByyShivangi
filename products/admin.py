# Basho Products - Admin Interface
#
# Enhanced admin panel for staff to manage products easily
# Access at: http://localhost:8000/admin/

from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Product, CustomOrder, CartItem, Order, OrderItem
from workshops.models import WorkshopRegistration


# ====================
# PRODUCT ADMIN
# Purpose: User-friendly product management interface
# ====================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for managing products
    Staff can easily add, edit, and manage all products
    """
    
    # What you see in the product list
    list_display = [
        'image_preview',
        'product_id', 
        'name', 
        'category_badge',
        'price_display', 
        'stock_status',
        'stock_quantity',
        'is_featured',
        'tags_display',
    ]
    
    # Filters on the right side
    list_filter = [
        'category', 
        'in_stock', 
        'is_featured', 
        'is_bestseller',
        'is_food_safe',
        'is_microwave_safe',
        'is_dishwasher_safe',
        'is_handmade',
    ]
    
    # Search box at the top
    search_fields = ['name', 'product_id', 'description', 'short_description']
    
    # Quick edit these fields directly in the list
    list_editable = ['stock_quantity', 'is_featured']
    
    # Can't edit these fields
    readonly_fields = ['created_at', 'updated_at', 'image_preview_large']
    
    # How many products to show per page
    list_per_page = 25
    
    # Organize the add/edit form into clear sections
    fieldsets = (
        ('📝 Basic Information', {
            'fields': ('product_id', 'name', 'category', 'description', 'short_description'),
            'description': 'Enter the basic product details'
        }),
        ('💰 Pricing & Stock', {
            'fields': ('price', 'in_stock', 'stock_quantity'),
            'description': 'Set price and manage inventory'
        }),
        ('📏 Product Specifications', {
            'fields': ('weight', 'dimensions'),
            'description': 'Physical dimensions (used for shipping)'
        }),
        ('✨ Product Features', {
            'fields': (
                'is_food_safe', 
                'is_microwave_safe', 
                'is_dishwasher_safe', 
                'is_handmade'
            ),
            'description': 'Check all features that apply'
        }),
        ('⭐ Display Settings', {
            'fields': ('is_featured', 'is_bestseller'),
            'description': 'Feature on homepage or mark as bestseller'
        }),
        ('🖼️ Images', {
            'fields': ('image_preview_large', 'image', 'image_url'),
            'description': 'Upload an image or provide a URL'
        }),
        ('🕒 Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': 'Automatic timestamps'
        }),
    )
    
    # Custom display methods
    def image_preview(self, obj):
        """Show small product image in list"""
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.image_url)
        return format_html('<span style="color: #999;">{}</span>', 'No image')
    image_preview.short_description = 'Image'
    
    def image_preview_large(self, obj):
        """Show larger preview in edit form"""
        if obj.image:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" />', obj.image_url)
        return 'No image uploaded'
    image_preview_large.short_description = 'Current Image'
    
    def category_badge(self, obj):
        """Show category with colored badge"""
        colors = {
            'tableware': '#4CAF50',
            'art': '#2196F3',
            'custom': '#FF9800',
        }
        color = colors.get(obj.category, '#757575')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">{}</span>',
            color, obj.get_category_display()
        )
    category_badge.short_description = 'Category'
    
    def price_display(self, obj):
        """Show price with rupee symbol"""
        return format_html('<strong>₹{}</strong>', f'{obj.price:,.2f}')
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'
    
    def stock_status(self, obj):
        """Show stock status with color indicator"""
        if obj.in_stock:
            if obj.stock_quantity > 10:
                return format_html('<span style="color: #4CAF50; font-weight: 600;">{}</span>', '● In Stock')
            elif obj.stock_quantity > 0:
                return format_html('<span style="color: #FF9800; font-weight: 600;">{}</span>', '● Low Stock')
            else:
                return format_html('<span style="color: #F44336; font-weight: 600;">{}</span>', '● Out of Stock')
        return format_html('<span style="color: #999; font-weight: 600;">{}</span>', '○ Unavailable')
    stock_status.short_description = 'Status'
    
    def tags_display(self, obj):
        """Show product feature tags"""
        tags = obj.get_tags()
        if tags:
            return ', '.join(tags[:2])  # Show first 2 tags
        return '-'
    tags_display.short_description = 'Features'
    
    tags_display.short_description = 'Features'
    
    # Bulk actions - select multiple products and perform these actions
    actions = ['mark_in_stock', 'mark_out_of_stock', 'mark_featured', 'unmark_featured', 'duplicate_product']
    
    def mark_in_stock(self, request, queryset):
        """Mark selected products as available"""
        updated = queryset.update(in_stock=True)
        self.message_user(request, f'✅ {updated} product(s) marked as IN STOCK')
    mark_in_stock.short_description = "✅ Mark as IN STOCK"
    
    def mark_out_of_stock(self, request, queryset):
        """Mark selected products as unavailable"""
        updated = queryset.update(in_stock=False, stock_quantity=0)
        self.message_user(request, f'❌ {updated} product(s) marked as OUT OF STOCK')
    mark_out_of_stock.short_description = "❌ Mark as OUT OF STOCK"
    
    def mark_featured(self, request, queryset):
        """Feature products on homepage"""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'⭐ {updated} product(s) marked as FEATURED')
    mark_featured.short_description = "⭐ Add to FEATURED products"
    
    def unmark_featured(self, request, queryset):
        """Remove from featured"""
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'Removed {updated} product(s) from FEATURED')
    unmark_featured.short_description = "Remove from FEATURED"
    
    def duplicate_product(self, request, queryset):
        """Duplicate selected products for easy variant creation"""
        count = 0
        for product in queryset:
            product.pk = None  # Create new instance
            product.product_id = f"{product.product_id}-copy"
            product.name = f"{product.name} (Copy)"
            product.save()
            count += 1
        self.message_user(request, f'📋 {count} product(s) duplicated successfully')
    duplicate_product.short_description = "📋 Duplicate selected products"


# ====================
# CUSTOM ORDER ADMIN
# Purpose: Manage customer custom order requests
# ====================
@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    """
    User-friendly interface for managing custom orders
    View requests, update status, contact customers
    """
    
    list_display = [
        'order_badge',
        'customer_info',
        'project_type_badge',
        'budget',
        'status_badge',
        'created_date',
        'action_needed',
    ]
    
    list_filter = [
        'status',
        'project_type',
        'budget',
        'created_at',
    ]
    
    search_fields = [
        'order_number',
        'name',
        'email',
        'phone',
        'description'
    ]
    
    list_editable = []
    
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'reference_preview']
    
    list_per_page = 20
    
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('📦 Order Information', {
            'fields': ('order_number', 'status'),
            'description': 'Order tracking details'
        }),
        ('👤 Customer Contact', {
            'fields': ('name', 'email', 'phone', 'gst_number'),
            'description': 'Customer information for follow-up'
        }),
        ('🎨 Order Details', {
            'fields': ('project_type', 'description', 'budget'),
            'description': 'What the customer wants'
        }),
        ('🖼️ Reference Images', {
            'fields': ('reference_preview', 'reference_images'),
            'description': 'Images provided by customer'
        }),
        ('🕒 Timeline', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Custom displays
    def order_badge(self, obj):
        """Show order number as a badge"""
        return format_html(
            '<code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-weight: 600;">{}</code>',
            obj.order_number
        )
    order_badge.short_description = 'Order #'
    order_badge.admin_order_field = 'order_number'
    
    def customer_info(self, obj):
        """Show customer name and contact"""
        return format_html(
            '<strong>{}</strong><br/><small style="color: #666;">📧 {} | 📱 {}</small>',
            obj.name, obj.email, obj.phone
        )
    customer_info.short_description = 'Customer'
    
    def project_type_badge(self, obj):
        """Show project type with color"""
        colors = {
            'tableware': '#4CAF50',
            'art': '#9C27B0',
            'corporate': '#FF5722',
            'event': '#FF9800',
            'other': '#607D8B',
        }
        color = colors.get(obj.project_type, '#757575')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 500;">{}</span>',
            color, obj.get_project_type_display()
        )
    project_type_badge.short_description = 'Project Type'
    
    def status_badge(self, obj):
        """Show status with color indicator"""
        status_config = {
            'pending': ('🔔 Pending Review', '#FF9800', '#FFF3E0'),
            'contacted': ('📞 Contacted', '#2196F3', '#E3F2FD'),
            'in_progress': ('⚙️ In Progress', '#9C27B0', '#F3E5F5'),
            'completed': ('✅ Completed', '#4CAF50', '#E8F5E9'),
            'cancelled': ('❌ Cancelled', '#F44336', '#FFEBEE'),
        }
        label, border_color, bg_color = status_config.get(obj.status, ('Unknown', '#999', '#f5f5f5'))
        return format_html(
            '<span style="background: {}; border-left: 3px solid {}; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 120px;">{}</span>',
            bg_color, border_color, label
        )
    status_badge.short_description = 'Status'
    
    def created_date(self, obj):
        """Show when order was received"""
        return obj.created_at.strftime('%b %d, %Y')
    created_date.short_description = 'Received'
    created_date.admin_order_field = 'created_at'
    
    def action_needed(self, obj):
        """Show if action is needed"""
        if obj.status == 'pending':
            return format_html('<span style="color: #F44336; font-weight: 600;">{}</span>', '⚠️ ACTION NEEDED')
        return '-'
    action_needed.short_description = 'Alert'
    
    def reference_preview(self, obj):
        """Show reference image if uploaded"""
        if obj.reference_images:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.reference_images.url
            )
        return 'No reference image provided'
    reference_preview.short_description = 'Reference Image'
    
    reference_preview.short_description = 'Reference Image'
    
    # Bulk actions for managing orders
    actions = ['mark_contacted', 'mark_in_progress', 'mark_completed', 'mark_pending']
    
    def mark_contacted(self, request, queryset):
        """Update status to contacted"""
        updated = queryset.update(status='contacted')
        self.message_user(request, f'📞 {updated} order(s) marked as CONTACTED')
    mark_contacted.short_description = "📞 Mark as CONTACTED"
    
    def mark_in_progress(self, request, queryset):
        """Update status to in progress"""
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'⚙️ {updated} order(s) marked as IN PROGRESS')
    mark_in_progress.short_description = "⚙️ Mark as IN PROGRESS"
    
    def mark_completed(self, request, queryset):
        """Update status to completed"""
        updated = queryset.update(status='completed')
        self.message_user(request, f'✅ {updated} order(s) marked as COMPLETED')
    mark_completed.short_description = "✅ Mark as COMPLETED"
    
    def mark_pending(self, request, queryset):
        """Update status back to pending"""
        updated = queryset.update(status='pending')
        self.message_user(request, f'🔔 {updated} order(s) marked as PENDING')
    mark_pending.short_description = "🔔 Mark as PENDING REVIEW"


# ====================
# CART ITEM ADMIN
# ====================
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """
    View cart items (for reference/debugging)
    """
    
    list_display = ['product', 'quantity', 'total_price', 'session_key', 'added_at']
    list_filter = ['added_at', 'product']
    search_fields = ['session_key', 'product__name']
    readonly_fields = ['added_at']
    
    def total_price(self, obj):
        """Show total price for this cart item"""
        return format_html('<strong>₹{}</strong>', f'{obj.get_total_price():,.2f}')
    total_price.short_description = 'Total Price'


# ====================
# ORDER ITEM INLINE
# ====================
class OrderItemInline(admin.TabularInline):
    """
    Display order items within the order form
    """
    model = OrderItem
    extra = 0
    fields = ['product', 'product_name', 'product_price', 'quantity', 'item_total']
    readonly_fields = ['item_total']
    
    def item_total(self, obj):
        """Display total for this line item"""
        if obj.pk:
            return format_html('<strong>₹{}</strong>', f'{obj.get_total_price():,.2f}')
        return '-'
    item_total.short_description = 'Line Total'


# ====================
# ORDER ADMIN
# ====================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Comprehensive order management interface
    Track all customer purchases and order history
    """
    
    list_display = [
        'order_number',
        'customer_name',
        'customer_phone',
        'status_badge',
        'payment_badge',
        'total_display',
        'item_count_display',
        'created_at',
        'payment_method',
    ]
    
    list_filter = [
        'status',
        'payment_status',
        'payment_method',
        'created_at',
        'shipping_state',
    ]
    
    search_fields = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'tracking_number',
    ]
    
    readonly_fields = [
        'order_number',
        'created_at',
        'updated_at',
        'item_count_display',
        'order_summary',
    ]
    
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('📋 Order Information', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at'),
        }),
        ('👤 Customer Details', {
            'fields': ('customer_name', 'customer_email', 'customer_phone'),
        }),
        ('📦 Shipping Address', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_state', 'shipping_pincode'),
        }),
        ('🏢 Billing Address (Optional)', {
            'fields': ('billing_address', 'gst_number'),
            'classes': ('collapse',),
        }),
        ('💰 Payment & Pricing', {
            'fields': (
                'payment_method',
                'payment_status',
                'subtotal',
                'shipping_charge',
                'tax_amount',
                'discount_amount',
                'total_amount',
            ),
        }),
        ('🚚 Shipping & Tracking', {
            'fields': ('tracking_number', 'courier_service', 'delivered_at'),
        }),
        ('📝 Notes', {
            'fields': ('order_notes', 'internal_notes'),
        }),
        ('📊 Order Summary', {
            'fields': ('order_summary', 'item_count_display'),
        }),
    )
    
    # Custom displays
    def status_badge(self, obj):
        """Show order status with colored badge"""
        colors = {
            'pending': '#FF9800',
            'confirmed': '#2196F3',
            'processing': '#9C27B0',
            'shipped': '#00BCD4',
            'delivered': '#4CAF50',
            'cancelled': '#F44336',
            'refunded': '#757575',
        }
        color = colors.get(obj.status, '#757575')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def payment_badge(self, obj):
        """Show payment status"""
        if obj.payment_status:
            return format_html('<span style="color: #4CAF50; font-weight: 600;">✓ Paid</span>')
        return format_html('<span style="color: #F44336; font-weight: 600;">✗ Unpaid</span>')
    payment_badge.short_description = 'Payment'
    
    def total_display(self, obj):
        """Show total amount"""
        return format_html('<strong>₹{}</strong>', f'{obj.total_amount:,.2f}')
    total_display.short_description = 'Total Amount'
    total_display.admin_order_field = 'total_amount'
    
    def item_count_display(self, obj):
        """Show number of items in order"""
        if obj.pk:
            count = obj.get_item_count()
            return format_html('<strong>{}</strong> items', count)
        return '-'
    item_count_display.short_description = 'Items'
    
    def order_summary(self, obj):
        """Show detailed order summary"""
        if not obj.pk:
            return '-'
        
        html = '<div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">'
        html += f'<strong>Order Items:</strong><br>'
        
        for item in obj.items.all():
            html += f'• {item.product_name} x {item.quantity} = ₹{item.get_total_price():,.2f}<br>'
        
        html += '<br><strong>Pricing Breakdown:</strong><br>'
        html += f'Subtotal: ₹{obj.subtotal:,.2f}<br>'
        if obj.shipping_charge > 0:
            html += f'Shipping: ₹{obj.shipping_charge:,.2f}<br>'
        if obj.tax_amount > 0:
            html += f'Tax: ₹{obj.tax_amount:,.2f}<br>'
        if obj.discount_amount > 0:
            html += f'Discount: -₹{obj.discount_amount:,.2f}<br>'
        html += f'<strong>Total: ₹{obj.total_amount:,.2f}</strong>'
        html += '</div>'
        
        return format_html(html)
    order_summary.short_description = 'Summary'
    
    # Bulk actions
    actions = [
        'mark_confirmed',
        'mark_processing',
        'mark_shipped',
        'mark_delivered',
        'mark_payment_received',
    ]
    
    def mark_confirmed(self, request, queryset):
        """Mark orders as confirmed"""
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'✅ {updated} order(s) marked as CONFIRMED')
    mark_confirmed.short_description = "✅ Mark as CONFIRMED"
    
    def mark_processing(self, request, queryset):
        """Mark orders as processing"""
        updated = queryset.update(status='processing')
        self.message_user(request, f'⚙️ {updated} order(s) marked as PROCESSING')
    mark_processing.short_description = "⚙️ Mark as PROCESSING"
    
    def mark_shipped(self, request, queryset):
        """Mark orders as shipped"""
        updated = queryset.update(status='shipped')
        self.message_user(request, f'🚚 {updated} order(s) marked as SHIPPED')
    mark_shipped.short_description = "🚚 Mark as SHIPPED"
    
    def mark_delivered(self, request, queryset):
        """Mark orders as delivered"""
        from django.utils import timezone
        updated = queryset.update(status='delivered', delivered_at=timezone.now())
        self.message_user(request, f'📦 {updated} order(s) marked as DELIVERED')
    mark_delivered.short_description = "📦 Mark as DELIVERED"
    
    def mark_payment_received(self, request, queryset):
        """Mark payment as received"""
        updated = queryset.update(payment_status=True, status='confirmed')
        self.message_user(request, f'💰 {updated} order(s) marked as PAID')
    mark_payment_received.short_description = "💰 Mark PAYMENT RECEIVED"


# ====================
# CUSTOM USER ADMIN
# ====================
class ProductOrderInline(admin.TabularInline):
    """Inline to show user's product orders"""
    model = Order
    extra = 0
    can_delete = False
    fields = ('order_number', 'total_amount', 'status', 'payment_status', 'created_at')
    readonly_fields = ('order_number', 'total_amount', 'status', 'payment_status', 'created_at')
    verbose_name = 'Product Order'
    verbose_name_plural = '🛒 Product Orders (Purchases)'


class WorkshopRegistrationInline(admin.TabularInline):
    """Inline to show user's workshop registrations"""
    model = WorkshopRegistration
    extra = 0
    can_delete = False
    fields = ('registration_number', 'workshop', 'total_amount', 'status', 'registered_at')
    readonly_fields = ('registration_number', 'workshop', 'total_amount', 'status', 'registered_at')
    verbose_name = 'Workshop Registration'
    verbose_name_plural = '🎨 Workshop Registrations (Purchases)'


# Unregister the default User admin
admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    """Custom User admin with purchases"""
    inlines = [ProductOrderInline, WorkshopRegistrationInline]
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined', 'purchase_count', 'total_spent')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    def purchase_count(self, obj):
        """Count of product orders + workshop registrations"""
        from workshops.models import WorkshopRegistration
        product_orders = obj.product_orders.count()
        workshop_regs = obj.workshop_registrations.count()
        total = product_orders + workshop_regs
        return format_html('<strong>{}</strong> (🛒{} + 🎨{})', total, product_orders, workshop_regs)
    purchase_count.short_description = 'Purchases'
    
    def total_spent(self, obj):
        """Total amount spent on products + workshops"""
        from django.db.models import Sum
        from workshops.models import WorkshopRegistration
        
        product_total = obj.product_orders.filter(payment_status=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        workshop_total = obj.workshop_registrations.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total = product_total + workshop_total
        
        return format_html('<strong>₹{}</strong>', f'{total:,.2f}')
    total_spent.short_description = 'Total Spent'
