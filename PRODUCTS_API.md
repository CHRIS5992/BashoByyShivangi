# Products Feature - API Documentation

## Overview
The Products module provides a complete system for managing handcrafted ceramic products, including browsing, filtering, and custom order submissions.

## Product Categories
- **Tableware**: Bowls, plates, cups, and dining sets
- **Art Pieces**: Decorative ceramic art and sculptures
- **Custom Order**: Personalized pottery creations

## API Endpoints

### 1. Products API

#### List All Products
```
GET /api/products/
```
Lists all available products with filtering and search capabilities. Returns products with details including pricing, dimensions, and stock status.

**Parameters:**
- `category` (optional): Filter by category (tableware, art, custom)
- `featured` (optional): Filter featured products (true/false)
- `search` (optional): Search in name or description
- `sort` (optional): Sort by featured, price-low, price-high, newest

#### Get Single Product
```
GET /api/products/{product_id}/
```
Retrieves detailed information for a specific product including all attributes and specifications.

---

### 2. Custom Orders API

#### Create Custom Order
```
POST /api/custom-orders/
```
Creates a new custom order request. Automatically generates a unique order number for tracking.

**Request Body Parameters:**
- `name` (required): Customer full name
- `email` (required): Email address
- `phone` (required): Phone number
- `project_type` (required): tableware, art, corporate, event, other
- `description` (required): Project requirements and vision
- `budget` (optional): 5000-10000, 10000-25000, 25000-50000, 50000+
- `gst_number` (optional): For invoice generation
- `reference_images` (optional): Reference images for the project

#### List Custom Orders
```
GET /api/custom-orders/
```
Lists all custom orders with status tracking.

#### Get Single Custom Order
```
GET /api/custom-orders/{id}/
```
Retrieves detailed information for a specific custom order.

---

### 3. Shipping Calculator API

#### Calculate Shipping Cost
```
POST /api/calculate-shipping/
```
Calculates shipping cost based on weight and pincode. Returns estimated shipping charges.

**Request Body Parameters:**
- `weight` (required): Total weight in kg
- `pincode` (required): Delivery pincode

---

## Models

### Product Model
- `product_id`: Unique identifier (string)
- `name`: Product name
- `category`: Category (tableware, art, custom)
- `description`: Full product description
- `short_description`: Brief description for cards
- `price`: Price in INR (decimal)
- `weight`: Weight in kg (for shipping)
- `dimensions`: Product dimensions
- `is_food_safe`: Food safety certified
- `is_microwave_safe`: Microwave safe
- `is_dishwasher_safe`: Dishwasher safe
- `is_handmade`: Handmade indicator
- `in_stock`: Stock availability
- `stock_quantity`: Available quantity
- `is_featured`: Featured on homepage
- `is_bestseller`: Bestseller badge
- `image`: Product image
- `image_url`: External image URL (alternative)

### CustomOrder Model
- `name`: Customer name
- `email`: Email address
- `phone`: Phone number
- `project_type`: Type (tableware, art, corporate, event, other)
- `description`: Project requirements
- `budget`: Budget range
- `gst_number`: GST number for invoicing
- `reference_images`: Reference images
- `status`: Order status (pending, contacted, in_progress, completed, cancelled)
- `order_number`: Unique order number (auto-generated)

---

## Sample Data

Run the following command to load sample products:
```bash
python load_sample_data.py
```

This will create 5 sample products across different categories.

---

## Admin Interface

Access the Django admin at `/admin/` to manage:
- Products
- Custom Orders

All models are registered with the admin interface with appropriate list displays, filters, and search capabilities.
