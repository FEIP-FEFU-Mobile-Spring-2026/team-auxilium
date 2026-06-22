import React from 'react';
import { ProductsProvider } from './src/context/ProductsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ProductsProvider>
      <AppNavigator />
    </ProductsProvider>
  );
}