# Basho Products Page - Django Backend
# 
# Database models for the products page
# These models define the structure of your database tables

from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User


# ====================
# PRODUCT MODEL
# Purpose: Stores all product information (bowls, plates, vases, etc.)
# ====================
class Product(models.Model):
    """
    Main product model for storing pottery items
    Your friend needs to:
    1. Run migrations to create this table in the database
    2. Populate this with actual product data
    3. Use this in views to display products
    """
    
    # Product Categories
    CATEGORY_CHOICES = [
        ('tableware', 'Tableware'),
        ('art', 'Art Pieces'),
        ('custom', 'Custom Order'),
    ]
    
    # Basic Information
    product_id = models.CharField(max_length=50, unique=True, help_text="Unique identifier (e.g., 'bowl-1')")
    name = models.CharField(max_length=200, help_text="Product name (e.g., 'Zen Breakfast Bowl')")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tableware')
    
    # Description & Details
    description = models.TextField(help_text="Product description")
    short_description = models.CharField(max_length=300, blank=True, help_text="Brief description for cards")
    
    # Pricing
    price = models.DecimalField(    
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Price in INR"
    )
    
    # Product Attributes
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Weight in kg (used for shipping calculation)"
    )
    dimensions = models.CharField(max_length=100, blank=True, help_text="e.g., '10 inches diameter'")
    
    # Features/Tags
    is_food_safe = models.BooleanField(default=True)
    is_microwave_safe = models.BooleanField(default=True)
    is_dishwasher_safe = models.BooleanField(default=True)
    is_handmade = models.BooleanField(default=True)
    
    # Inventory
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    # Display
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")
    is_bestseller = models.BooleanField(default=False)
    
    # Image
    image = models.ImageField(upload_to='products/', blank=True, null=True, help_text="Product image")
    image_url = models.URLField(blank=True, help_text="Alternative: external image URL")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
    
    def __str__(self):
        return f"{self.name} - ₹{self.price}"
    
    def get_tags(self):
        """Returns list of product tags for display"""
        tags = []
        if self.is_food_safe:
            tags.append('Food Safe')
        if self.is_microwave_safe:
            tags.append('Microwave Safe')
        if self.is_dishwasher_safe:
            tags.append('Dishwasher Safe')
        if self.is_handmade:
            tags.append('Handmade')
        return tags


# ====================
# CUSTOM ORDER MODEL
# Purpose: Stores custom order requests from customers
# ====================
class CustomOrder(models.Model):
    """
    Stores custom pottery order requests
    Your friend needs to:
    1. Create views to handle form submissions
    2. Send email notifications when orders are received
    3. Add admin interface to manage orders
    """
    
    PROJECT_TYPE_CHOICES = [
        ('tableware', 'Tableware Set'),
        ('art', 'Art Piece'),
        ('corporate', 'Corporate Order'),
        ('event', 'Event/Wedding'),
        ('other', 'Other'),
    ]
    
    BUDGET_CHOICES = [
        ('5000-10000', '₹5,000 - ₹10,000'),
        ('10000-25000', '₹10,000 - ₹25,000'),
        ('25000-50000', '₹25,000 - ₹50,000'),
        ('50000+', '₹50,000+'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('contacted', 'Customer Contacted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Customer Information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Order Details
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    description = models.TextField(help_text="Customer's vision/requirements")
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    
    # Optional Fields
    gst_number = models.CharField(max_length=15, blank=True, help_text="For invoice generation")
    reference_images = models.ImageField(upload_to='custom_orders/', blank=True, null=True)
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Custom Order'
        verbose_name_plural = 'Custom Orders'
    
    def __str__(self):
        return f"{self.order_number} - {self.name}"
    
    def save(self, *args, **kwargs):
        """Auto-generate order number if not exists"""
        if not self.order_number:
            from datetime import datetime
            self.order_number = f"CO-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)


# ====================
# CART ITEM MODEL (Optional - for future use)
# Purpose: Store cart items for logged-in users
# ====================
class CartItem(models.Model):
    """
    Optional: For implementing persistent cart functionality
    Currently the frontend uses localStorage
    This can be used later for logged-in users
    """
    # If using Django's built-in User model:
    # user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    
    session_key = models.CharField(max_length=40, help_text="For guest users")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    def get_total_price(self):
        return self.product.price * self.quantity


# ====================
# ORDER MODEL
# Purpose: Track customer purchases and order history
# ====================
class Order(models.Model):
    """
    Stores customer orders for products
    Used for order tracking, customer support, and business analytics
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('confirmed', 'Payment Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cod', 'Cash on Delivery'),
        ('upi', 'UPI'),
        ('card', 'Credit/Debit Card'),
        ('netbanking', 'Net Banking'),
        ('wallet', 'Digital Wallet'),
    ]
    
    # Order Identification
    order_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # User Association (Optional - null if guest checkout)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, 
                            null=True, blank=True, related_name='product_orders',
                            help_text="Linked user if logged in during checkout")
    
    # Customer Information
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    # Shipping Address
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=10)
    
    # Billing (optional if different from shipping)
    billing_address = models.TextField(blank=True, help_text="Leave blank if same as shipping")
    
    # Order Details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod')
    payment_status = models.BooleanField(default=False, help_text="Payment received?")
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total before tax/shipping")
    shipping_charge = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Final amount to pay")
    
    # Additional Info
    order_notes = models.TextField(blank=True, help_text="Customer notes/special instructions")
    internal_notes = models.TextField(blank=True, help_text="Staff notes (not visible to customer)")
    
    # Tracking
    tracking_number = models.CharField(max_length=100, blank=True, help_text="Courier tracking number")
    courier_service = models.CharField(max_length=100, blank=True, help_text="e.g., BlueDart, DHL")
    
    # GST (Optional)
    gst_number = models.CharField(max_length=15, blank=True, help_text="For business customers")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product Order'
        verbose_name_plural = 'Purchases - Product Orders'
    
    def __str__(self):
        return f"{self.order_number} - {self.customer_name}"
    
    def save(self, *args, **kwargs):
        """Auto-generate order number if not exists"""
        if not self.order_number:
            from datetime import datetime
            # Format: ORD-YYYYMMDDHHMMSS
            self.order_number = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)
    
    def get_item_count(self):
        """Returns total number of items in order"""
        return sum(item.quantity for item in self.items.all())


# ====================
# ORDER ITEM MODEL
# Purpose: Individual items within an order
# ====================
class OrderItem(models.Model):
    """
    Individual products within an order
    One order can have multiple products
    """
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)  # Don't delete if product is deleted
    
    # Snapshot of product details at time of purchase
    product_name = models.CharField(max_length=200, help_text="Product name at time of order")
    product_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price at time of order")
    
    quantity = models.PositiveIntegerField(default=1)
    
    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
    
    def get_total_price(self):
        """Returns total price for this line item"""
        return self.product_price * self.quantity
    
    def save(self, *args, **kwargs):
        """Capture product details at time of order"""
        if not self.product_name:
            self.product_name = self.product.name
        if not self.product_price:
            self.product_price = self.product.price
        super().save(*args, **kwargs)
