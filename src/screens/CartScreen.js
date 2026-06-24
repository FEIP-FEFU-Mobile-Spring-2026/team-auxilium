import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPriceInKopecks,
    totalItems,
    getCartItemsWithDetails,
    updateCatalog,
  } = useCart();

  const { filteredItems } = useProducts(); // получаем товары из каталога

  useEffect(() => {
    if (filteredItems.length) {
      updateCatalog(filteredItems);
    }
  }, [filteredItems, updateCatalog]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });

  const cartItemsWithDetails = getCartItemsWithDetails();

  const formatPrice = (kopecks) => {
    const rubles = Math.floor(kopecks / 100);
    return rubles.toLocaleString('ru-RU') + ' ₽';
  };

  const handleClearCart = () => {
    Alert.alert(
      'Очистка корзины',
      'Вы уверены, что хотите удалить все товары из корзины?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите имя');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (cartItemsWithDetails.length === 0) return;
    if (!validateForm()) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setShowSuccess(true);
    }, 800);
  };

  const handleBackToCatalog = () => {
    setShowSuccess(false);
    setFormData({ name: '', email: '', comment: '' });
    navigation.navigate('Каталог');
  };

  const renderCartItem = ({ item }) => {
    const itemTotal = item.product.priceInKopecks * item.quantity;
    const priceInRubles = formatPrice(itemTotal);

    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.product.imageUrl }}
          style={styles.itemImage}
          contentFit="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          <Text style={styles.itemSize}>Размер: {item.size.name}</Text>
          <Text style={styles.itemPrice}>{priceInRubles}</Text>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.productId, item.sizeId, -1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.productId, item.sizeId, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.productId, item.sizeId)}
          >
            <Ionicons name="trash-outline" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
        </View>
        <Text style={styles.successTitle}>Заказ успешно оформлен</Text>
        <Text style={styles.successSubtitle}>
          Подтверждение и чек отправили на вашу почту
        </Text>
        <TouchableOpacity style={styles.successButton} onPress={handleBackToCatalog}>
          <Text style={styles.successButtonText}>Вернуться на главную</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (cartItemsWithDetails.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Корзина пуста</Text>
        <Text style={styles.emptySubtitle}>
          Добавьте товары из каталога, чтобы заполнить корзину
        </Text>
      </SafeAreaView>
    );
  }

  const totalInRubles = formatPrice(totalPriceInKopecks);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Корзина</Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Очистить</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={cartItemsWithDetails}
          keyExtractor={(item) => `${item.productId}_${item.sizeId}`}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Данные для заказа</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Имя *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Введите ваше имя"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Почта *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Введите ваш email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Комментарий к заказу</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.comment}
              onChangeText={(text) => setFormData({ ...formData, comment: text })}
              placeholder="Дополнительные пожелания"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.totalPrice}>{totalInRubles}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, isCheckingOut && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={isCheckingOut || cartItemsWithDetails.length === 0}
        >
          <Text style={styles.checkoutButtonText}>
            {isCheckingOut ? 'Оформление...' : 'Оформить'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  successButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clearText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  listContent: {
    padding: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemSize: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    width: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 6,
    marginTop: 4,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  checkoutButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#b39ddb',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen;