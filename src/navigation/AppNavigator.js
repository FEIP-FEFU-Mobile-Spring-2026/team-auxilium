import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Каталог') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Корзина') {
              iconName = focused ? 'cart' : 'cart-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Каталог" component={CatalogScreen} />
        <Tab.Screen name="Корзина" component={CartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;