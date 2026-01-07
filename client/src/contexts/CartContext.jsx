import { createContext, useContext, useState, useEffect } from 'react';
import { useAlert } from './AlertContext.jsx';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    let success = false;
    let message = '';

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity + quantity > product.stock) {
          message = 'Not enough stock';
          success = false;
          return prev;
        }
        message = 'Added to cart';
        success = true;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          message = 'Not enough stock';
          success = false;
          return prev;
        }
        message = 'Added to cart';
        success = true;
        return [...prev, { ...product, quantity }];
      }
    });

    if (message) showAlert(message, success ? 'success' : 'error');
    return success;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const item = cart.find((i) => i.id === productId);
    if (!item) return false;
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }
    if (quantity > item.stock) {
      showAlert('Not enough stock', 'error');
      return false;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
    return true;
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
