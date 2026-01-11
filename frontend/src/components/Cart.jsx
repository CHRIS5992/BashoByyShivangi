import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, CalendarHeart, Clock, User, Users } from 'lucide-react';
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
      <section className="cart-hero" style={{
        backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%), url('/static/images/gallery/cartheader.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
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
              <div key={item.cartKey} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image_url_full || item.image || '/static/images/products/placeholder.svg'}
                    alt={item.name}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  {item.type === 'workshop' && (
                    <div className="workshop-details">
                      <p className="workshop-slot-info">
                        <CalendarHeart size={16} color="#652810" strokeWidth={2} />
                        {new Date(item.slotDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="workshop-slot-info">
                        <Clock size={16} color="#652810" strokeWidth={2} />
                        {item.slotStartTime?.substring(0, 5)} - {item.slotEndTime?.substring(0, 5)}
                      </p>
                      <p className="workshop-slot-info">
                        <User size={16} color="#652810" strokeWidth={2} />
                        {item.participantName}
                      </p>
                      <p className="workshop-slot-info">
                        <Users size={16} color="#652810" strokeWidth={2} />
                        {item.quantity} participant{item.quantity > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <p className="item-price">₹{parseFloat(item.price).toLocaleString('en-IN')}{item.type === 'workshop' ? ' per person' : ''}</p>
                </div>

                <div className="item-quantity">
                  {item.type !== 'workshop' && (
                    <>
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </>
                  )}
                  {item.type === 'workshop' && (
                    <span className="quantity-fixed">{item.quantity} {item.quantity > 1 ? 'people' : 'person'}</span>
                  )}
                </div>

                <div className="item-total">
                  <p className="total-price">
                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.cartKey)}
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
