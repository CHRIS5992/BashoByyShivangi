import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    const cartKey = currentUser ? `basho_cart_${currentUser.uid}` : 'basho_cart_guest';
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    } else {
      // If user just logged in/out, clear the cart state
      setCart([]);
    }
  }, [currentUser]); // Reload cart when user changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = currentUser ? `basho_cart_${currentUser.uid}` : 'basho_cart_guest';
    if (cart.length > 0) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } else {
      // Remove empty cart from localStorage
      localStorage.removeItem(cartKey);
    }
  }, [cart, currentUser]);

  const addToCart = (item) => {
    setCart(prevCart => {
      // For workshops with slots, create unique ID based on workshop + slot
      const itemKey = item.type === 'workshop' && item.slotId 
        ? `workshop-${item.id}-slot-${item.slotId}` 
        : item.id;
      
      const existingItem = prevCart.find(cartItem => {
        if (item.type === 'workshop' && cartItem.type === 'workshop') {
          // For workshops, match by workshop ID and slot ID
          return cartItem.id === item.id && cartItem.slotId === item.slotId;
        }
        return cartItem.id === itemKey;
      });
      
      if (existingItem && item.type !== 'workshop') {
        // Only allow quantity increase for products, not workshops
        return prevCart.map(cartItem =>
          cartItem.id === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item (workshops always added as new items even if same workshop)
        return [...prevCart, { ...item, cartKey: itemKey, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prevCart => prevCart.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => {
      // For workshops, count as 1 item regardless of participants
      if (item.type === 'workshop') {
        return count + 1;
      }
      // For products, count by quantity
      return count + item.quantity;
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
