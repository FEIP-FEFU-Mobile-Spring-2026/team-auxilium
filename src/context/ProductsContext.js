import React, { createContext, useState, useEffect, useContext } from 'react';
import data from '../../assets/products.json';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const { categories: cats = [], products: prods = [] } = data;

    const newCategory = { id: 'new', name: 'Новинки' };
    const categoryList = [newCategory, ...cats];
    setCategories(categoryList);

    setAllProducts(prods);

    setSelectedCategoryId('new');
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;

    if (selectedCategoryId === 'new') {
      const newItems = allProducts.filter(item =>
        item.tags && item.tags.includes('New')
      );
      setFilteredProducts(newItems);
    } else {
      const filtered = allProducts.filter(item =>
        item.categoryId === selectedCategoryId
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategoryId, allProducts]);

  const changeCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <ProductsContext.Provider value={{
      categories,
      selectedCategoryId,
      filteredProducts,
      changeCategory,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);