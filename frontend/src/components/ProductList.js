import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const ProductList = ({ products, loading, onProductClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent modal from opening
    addToCart({
      id: product.id,  // Database ID for backend
      product_id: product.product_id,  // Product ID for display
      name: product.name,
      price: product.price,
      image: product.image,
      image_url_full: product.image_url_full,
      type: 'product'
    });
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="product-card fade-in" 
                data-category={product.category}
                data-price={product.price}
                onClick={() => onProductClick && onProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  <img 
                    src={product.image_url_full || product.image || '/static/images/products/placeholder.svg'} 
                    alt={product.name}
                    className="placeholder-img"
                  />
                  {product.is_bestseller && (
                    <span className="product-badge">Bestseller</span>
                  )}
                  {!product.is_bestseller && product.is_featured && (
                    <span className="product-badge">Featured</span>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-meta">
                    {product.tags && product.tags.map((tag, index) => (
                      <span key={index} className="meta-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="product-description">
                    {product.short_description || product.description}
                  </p>
                  <div className="product-details">
                    <span className="product-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                    <div className="product-actions">
                      <button 
                        className="btn-add-to-cart" 
                        onClick={(e) => handleAddToCart(product, e)}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} color="#ffffff" strokeWidth={2.5} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', width: '100%', padding: 'var(--spacing-xl)'}}>
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
