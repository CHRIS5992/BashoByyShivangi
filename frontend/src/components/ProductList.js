import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const ProductList = ({ products, loading }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image,
      image_url_full: product.image_url_full
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
                        className="btn-icon" 
                        onClick={() => handleAddToCart(product)}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={20} color="#ffffff" strokeWidth={2.5} />
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
