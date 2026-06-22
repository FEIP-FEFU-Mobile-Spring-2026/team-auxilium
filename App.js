import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProductsProvider } from './src/context/ProductsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProductsProvider>
        <AppNavigator />
      </ProductsProvider>
    </GestureHandlerRootView>
  );
}