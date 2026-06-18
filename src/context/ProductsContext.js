import React, { createContext, useState, useEffect, useContext } from 'react';
import data from '../../assets/products.json';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const { categories: cats = [], items: items = [] } = data;

    const newCategory = { id: 'new', name: 'Новинки' };
    const categoryList = [newCategory, ...cats];
    setCategories(categoryList);

    setAllItems(items);

    setSelectedCategoryId('new');
  }, []);

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

  return (
    <ProductsContext.Provider value={{
      categories,
      selectedCategoryId,
      filteredItems,
      changeCategory,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);