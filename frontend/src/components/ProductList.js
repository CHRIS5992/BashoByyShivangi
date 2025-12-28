import React from 'react';

const ProductList = ({ products, loading }) => {
  const addToCart = (productId, productName, price) => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('basho_cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: price,
        quantity: 1
      });
    }
    
    localStorage.setItem('basho_cart', JSON.stringify(cart));
    alert(`${productName} added to cart!`);
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
                        onClick={() => addToCart(product.product_id, product.name, product.price)}
                        title="Add to Cart"
                      >
                        🛒
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
