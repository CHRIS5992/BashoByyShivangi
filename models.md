## User

- username (CharField, unique)
- email (EmailField, unique)
- first_name (CharField)
- last_name (CharField)
- phone (CharField)
- is_active (BooleanField)
- is_staff (BooleanField)
- date_joined (DateTimeField)
- last_login (DateTimeField)

## Customer

- user (OneToOneField -> User)
- phone (CharField)
- date_of_birth (DateField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

# Product

- product_id (CharField, unique)
- name (CharField)
- category (CharField, choices)
- description (TextField)
- short_description (CharField)
- price (DecimalField)
- weight (DecimalField)
- dimensions (CharField)
- is_food_safe (BooleanField)
- is_microwave_safe (BooleanField)
- is_dishwasher_safe (BooleanField)
- is_handmade (BooleanField)
- in_stock (BooleanField)
- stock_quantity (IntegerField)
- is_featured (BooleanField)
- is_bestseller (BooleanField)
- image (ImageField)
- image_url (URLField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

## Review

- product (ForeignKey -> Product, related_name='reviews')
- user (ForeignKey -> User)
- rating (IntegerField)
- title (CharField)
- comment (TextField)
- is_verified_purchase (BooleanField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

# CustomOrder

- name (CharField)
- email (EmailField)
- phone (CharField)
- project_type (CharField, choices)
- description (TextField)
- budget (CharField, choices)
- gst_number (CharField)
- reference_images (ImageField)
- status (CharField, choices)
- order_number (CharField, unique)
- created_at (DateTimeField)
- updated_at (DateTimeField)

# CartItem

- session_key (CharField)
- product (ForeignKey -> Product)
- quantity (PositiveIntegerField)
- added_at (DateTimeField)

## ShippingAddress

- user (ForeignKey -> User, related_name='addresses')
- full_name (CharField)
- phone (CharField)
- address_line1 (CharField)
- address_line2 (CharField)
- city (CharField)
- state (CharField)
- pincode (CharField)
- is_default (BooleanField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

## Order

- order_number (CharField, unique)
- user (ForeignKey -> User, related_name='orders')
- shipping_address (ForeignKey -> ShippingAddress)
- status (CharField, choices)
- subtotal (DecimalField)
- shipping_cost (DecimalField)
- tax (DecimalField)
- total_amount (DecimalField)
- payment_method (CharField, choices)
- payment_status (CharField, choices)
- notes (TextField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

## OrderItem

- order (ForeignKey -> Order, related_name='items')
- product (ForeignKey -> Product)
- quantity (PositiveIntegerField)
- price_at_purchase (DecimalField)
- subtotal (DecimalField)

## Payment

- order (OneToOneField -> Order)
- payment_id (CharField, unique)
- payment_method (CharField, choices)
- amount (DecimalField)
- status (CharField, choices)
- transaction_id (CharField)
- payment_gateway (CharField)
- payment_date (DateTimeField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

## Wishlist

- user (ForeignKey -> User, related_name='wishlist')
- product (ForeignKey -> Product)
- added_at (DateTimeField)

## Coupon

- code (CharField, unique)
- description (CharField)
- discount_type (CharField, choices)
- discount_value (DecimalField)
- min_purchase_amount (DecimalField)
- max_discount_amount (DecimalField)
- usage_limit (IntegerField)
- used_count (IntegerField)
- valid_from (DateTimeField)
- valid_until (DateTimeField)
- is_active (BooleanField)
- created_at (DateTimeField)

# Workshop

- workshop_id (CharField, unique)
- name (CharField)
- workshop_type (CharField, choices)
- difficulty_level (CharField, choices)
- description (TextField)
- short_description (CharField)
- duration_hours (DecimalField)
- price (DecimalField)
- max_participants (IntegerField)
- min_age (IntegerField)
- image (ImageField)
- is_active (BooleanField)
- available_slots (IntegerField)
- includes_materials (BooleanField)
- includes_refreshments (BooleanField)
- takes_home_creation (BooleanField)
- is_featured (BooleanField)
- is_popular (BooleanField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

# WorkshopSlot

- workshop (ForeignKey -> Workshop, related_name='slots')
- date (DateField)
- start_time (TimeField)
- end_time (TimeField)
- available_spots (IntegerField)
- is_available (BooleanField)

# WorkshopRegistration

- workshop (ForeignKey -> Workshop, related_name='registrations')
- slot (ForeignKey -> WorkshopSlot, related_name='registrations')
- full_name (CharField)
- email (EmailField)
- phone (CharField)
- number_of_participants (IntegerField)
- special_requests (TextField)
- experience_level (CharField)
- status (CharField, choices)
- total_amount (DecimalField)
- registered_at (DateTimeField)
- updated_at (DateTimeField)

## WorkshopPayment

- registration (OneToOneField -> WorkshopRegistration)
- payment_id (CharField, unique)
- payment_method (CharField, choices)
- amount (DecimalField)
- status (CharField, choices)
- transaction_id (CharField)
- payment_date (DateTimeField)
- created_at (DateTimeField)

## WorkshopReview

- workshop (ForeignKey -> Workshop, related_name='reviews')
- user (ForeignKey -> User)
- registration (ForeignKey -> WorkshopRegistration)
- rating (IntegerField)
- comment (TextField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

## ContactInquiry

- name (CharField)
- email (EmailField)
- phone (CharField)
- subject (CharField)
- message (TextField)
- status (CharField, choices)
- created_at (DateTimeField)
- replied_at (DateTimeField)

## NewsletterSubscription

- email (EmailField, unique)
- name (CharField)
- is_active (BooleanField)
- subscribed_at (DateTimeField)
- unsubscribed_at (DateTimeField)
