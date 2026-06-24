import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const CartBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const AppNavigator = () => {
  const { totalItems } = useCart();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
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
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              height: Platform.OS === 'ios' ? 80 : 64,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              paddingTop: 4,
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#e8e8e8',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              paddingBottom: Platform.OS === 'ios' ? 0 : 4,
            },
            headerStyle: {
              backgroundColor: '#6200ee',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: '#ffffff',
              fontWeight: '600',
              fontSize: 18,
            },
            headerTintColor: '#ffffff',
          })}
        >
          <Tab.Screen 
            name="Каталог" 
            component={CatalogScreen} 
            options={{
              title: 'Каталог',
            }}
          />
          <Tab.Screen
            name="Корзина"
            component={CartScreen}
            options={{
              title: 'Корзина',
              tabBarIcon: ({ focused, color, size }) => {
                const iconName = focused ? 'cart' : 'cart-outline';
                return (
                  <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={size} color={color} />
                    <CartBadge count={totalItems} />
                  </View>
                );
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#d32f2f',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppNavigator;