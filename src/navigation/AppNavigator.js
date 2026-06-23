import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const CartBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

const AppNavigator = () => {
  const { totalItems } = useCart();

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
          tabBarStyle: { height: 60, paddingBottom: 8 },
          tabBarLabelStyle: { fontSize: 12 },
        })}
      >
        <Tab.Screen name="Каталог" component={CatalogScreen} />
        <Tab.Screen
          name="Корзина"
          component={CartScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              const iconName = focused ? 'cart' : 'cart-outline';
              return (
                <View>
                  <Ionicons name={iconName} size={size} color={color} />
                  <CartBadge count={totalItems} />
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppNavigator;