import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCatalog } from '../services/api';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCatalog();
      const { categories: cats = [], items: items = [] } = data;

      const newCategory = { id: 'new', name: 'Новинки' };
      const categoryList = [newCategory, ...cats];
      setCategories(categoryList);
      setAllItems(items);
      setSelectedCategoryId('new');
    } catch (err) {
      setError(err.message || 'Не удалось загрузить каталог');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Фильтрация
  useEffect(() => {
    if (!allItems.length) {
      setFilteredItems([]);
      return;
    }

    if (selectedCategoryId === 'new') {
      const newItems = allItems.filter(item =>
        item.tags && item.tags.includes('New')
      );
      setFilteredItems(newItems);
    } else {
      const filtered = allItems.filter(item =>
        item.categoryId === selectedCategoryId
      );
      setFilteredItems(filtered);
    }
  }, [selectedCategoryId, allItems]);

  const changeCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const retry = () => {
    loadCatalog();
  };

  return (
    <ProductsContext.Provider value={{
      categories,
      selectedCategoryId,
      filteredItems,
      changeCategory,
      loading,
      error,
      retry,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);