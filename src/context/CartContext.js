import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();
const STORAGE_KEY = '@cart_items';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      const { fetchCatalog } = await import('../services/api');
      try {
        const data = await fetchCatalog();
        setCatalogItems(data.items || []);
      } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
      }
    };
    loadCatalog();
  }, []);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validItems = parsed.filter(
          (item) => item.productId && item.sizeId && typeof item.quantity === 'number'
        );
        setCartItems(validItems);
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (items) => {
    try {
      const storageData = items.map(({ productId, sizeId, quantity }) => ({
        productId,
        sizeId,
        quantity,
      }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  };

  const getCartItemsWithDetails = useCallback(() => {
    if (!catalogItems.length) return [];

    return cartItems
      .map((cartItem) => {
        const product = catalogItems.find((p) => p.id === cartItem.productId);
        if (!product) return null;

        const size = product.sizes?.find((s) => s.id === cartItem.sizeId);
        if (!size) return null;

        return {
          ...cartItem,
          product,
          size,
        };
      })
      .filter(Boolean);
  }, [cartItems, catalogItems]);

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
        newItems = [
          ...prev,
          {
            productId: product.id,
            sizeId: sizeId,
            quantity: 1,
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

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCart([]);
  }, []);

  const totalPriceInKopecks = useCallback(() => {
    const itemsWithDetails = getCartItemsWithDetails();
    return itemsWithDetails.reduce(
      (sum, item) => sum + item.product.priceInKopecks * item.quantity,
      0
    );
  }, [getCartItemsWithDetails]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateCatalog = useCallback((items) => {
    setCatalogItems(items);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPriceInKopecks: totalPriceInKopecks(),
        totalItems,
        getCartItemsWithDetails,
        updateCatalog,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);