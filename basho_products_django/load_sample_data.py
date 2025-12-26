# Sample Products Data
# Use this file to quickly populate the database with sample products

from products.models import Product

# Sample product data
SAMPLE_PRODUCTS = [
    {
        'product_id': 'bowl-1',
        'name': 'Zen Breakfast Bowl',
        'category': 'tableware',
        'price': 2500,
        'description': 'Hand-thrown stoneware bowl with natural glaze. Perfect for rice, noodles, or soups.',
        'short_description': 'Hand-thrown stoneware bowl with natural glaze',
        'weight': 0.5,
        'dimensions': '6 inches diameter',
        'in_stock': True,
        'stock_quantity': 15,
        'is_featured': True,
        'is_bestseller': True,
        'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    },
    {
        'product_id': 'plate-1',
        'name': 'Wabi-Sabi Dinner Plate',
        'category': 'tableware',
        'price': 3200,
        'description': 'Earthy dinner plate with organic edges and natural texture.',
        'short_description': 'Earthy dinner plate with organic edges',
        'weight': 0.7,
        'dimensions': '10 inches diameter',
        'in_stock': True,
        'stock_quantity': 12,
        'is_featured': True,
        'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    },
    {
        'product_id': 'cup-1',
        'name': 'Matcha Tea Cup',
        'category': 'tableware',
        'price': 1800,
        'description': 'Minimalist tea cup inspired by Japanese chanoyu tradition. Holds 180ml.',
        'short_description': 'Minimalist Japanese-inspired tea cup',
        'weight': 0.3,
        'dimensions': '3.5 inches diameter, holds 180ml',
        'in_stock': True,
        'stock_quantity': 20,
        'image_url': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
    },
    {
        'product_id': 'vase-1',
        'name': 'Ikebana Tall Vase',
        'category': 'art',
        'price': 5500,
        'description': 'Tall sculptural vase inspired by Japanese ikebana. Each piece is unique.',
        'short_description': 'Tall sculptural vase for ikebana',
        'weight': 1.2,
        'dimensions': '14 inches tall',
        'in_stock': True,
        'stock_quantity': 5,
        'is_featured': True,
        'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    },
    {
        'product_id': 'planter-1',
        'name': 'Zen Garden Planter',
        'category': 'art',
        'price': 4200,
        'description': 'Handmade planter with drainage hole. Perfect for succulents and small plants.',
        'short_description': 'Handmade planter for small plants',
        'weight': 0.8,
        'dimensions': '5 inches diameter',
        'in_stock': True,
        'stock_quantity': 8,
        'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    },
]


def load_sample_products():
    """
    Load sample products into the database
    
    Usage:
    1. Open Django shell: python manage.py shell
    2. Run: from load_sample_data import load_sample_products
    3. Run: load_sample_products()
    """
    
    print("Loading sample products...")
    
    for product_data in SAMPLE_PRODUCTS:
        product, created = Product.objects.get_or_create(
            product_id=product_data['product_id'],
            defaults=product_data
        )
        
        if created:
            print(f"✓ Created: {product.name}")
        else:
            # Update existing product with new data (especially image_url)
            for key, value in product_data.items():
                if key != 'product_id':  # Don't update the unique key
                    setattr(product, key, value)
            product.save()
            print(f"✓ Updated: {product.name}")
    
    print(f"\nTotal products in database: {Product.objects.count()}")
    print("Done!")


if __name__ == '__main__':
    load_sample_products()
