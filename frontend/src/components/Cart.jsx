import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <ShoppingBag size={80} color="#652810" strokeWidth={1.5} />
          <h2>Your Cart is Empty</h2>
          <p>Add some beautiful pottery pieces to your cart</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/products')}
          >
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Hero Section */}
      <section className="cart-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="japanese-accent">買い物</span>
            <span className="main-title">Shopping Cart</span>
          </h1>
          <p className="hero-subtitle">Review your selections</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="cart-content">
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <h2>Cart Items ({cart.length})</h2>
              <button 
                className="btn-text" 
                onClick={clearCart}
              >
                Clear All
              </button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image_url_full || item.image || '/static/images/products/placeholder.svg'} 
                    alt={item.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">
                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
