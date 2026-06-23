import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();
const STORAGE_KEY = '@cart_items';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  };

  const addToCart = useCallback((product, sizeId) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.sizeId === sizeId
      );

      let newItems;
      if (existingIndex !== -1) {
        newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
      } else {
        const size = product.sizes?.find((s) => s.id === sizeId);
        newItems = [
          ...prev,
          {
            productId: product.id,
            sizeId: sizeId,
            sizeName: size?.name || '',
            quantity: 1,
            productName: product.name,
            priceInKopecks: product.priceInKopecks,
            imageUrl: product.imageUrl,
          },
        ];
      }

      saveCart(newItems);
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((productId, sizeId) => {
    setCartItems((prev) => {
      const newItems = prev.filter(
        (item) => !(item.productId === productId && item.sizeId === sizeId)
      );
      saveCart(newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId, sizeId, delta) => {
    setCartItems((prev) => {
      const index = prev.findIndex(
        (item) => item.productId === productId && item.sizeId === sizeId
      );
      if (index === -1) return prev;

      const newItems = [...prev];
      const newQuantity = newItems[index].quantity + delta;

      if (newQuantity <= 0) {
        newItems.splice(index, 1);
      } else {
        newItems[index] = {
          ...newItems[index],
          quantity: newQuantity,
        };
      }

      saveCart(newItems);
      return newItems;
    });
  }, []);

  // Очистка корзины
  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCart([]);
  }, []);

  const totalPriceInKopecks = cartItems.reduce(
    (sum, item) => sum + item.priceInKopecks * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPriceInKopecks,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);