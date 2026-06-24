import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductsProvider } from './src/context/ProductsContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProductsProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </ProductsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}