import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';

const ProductBottomSheet = ({ product, onClose }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose?.();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!product) return null;

  const priceInRubles = (product.priceInKopecks / 100).toFixed(2);

  const handleSizeSelect = (sizeId) => {
    setSelectedSize(sizeId === selectedSize ? null : sizeId);
  };

  const showCharacteristics = () => {
    const { material, weight, season, countryOfOrigin } = product;
    const info = `
Материал: ${material || '—'}
Вес: ${weight || '—'}
Сезон: ${season || '—'}
Страна производства: ${countryOfOrigin || '—'}
    `.trim();
    Alert.alert('Характеристики', info);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Выберите размер', 'Пожалуйста, выберите размер перед добавлением в корзину');
      return;
    }
    addToCart(product, selectedSize);
    Alert.alert('Добавлено', `${product.name} добавлен в корзину`);
    handleClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={1}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.tagsContainer}>
          {product.tags?.map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{priceInRubles} ₽</Text>
        <Text style={styles.description} numberOfLines={3}>
          {product.longDescription}
        </Text>

        {/* Размеры */}
        {product.sizes && product.sizes.length > 0 && (
          <View style={styles.sizesContainer}>
            <Text style={styles.sizesLabel}>Размеры:</Text>
            <FlatList
              horizontal
              data={product.sizes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sizeItem,
                    selectedSize === item.id && styles.sizeItemActive,
                  ]}
                  onPress={() => handleSizeSelect(item.id)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === item.id && styles.sizeTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sizesList}
            />
          </View>
        )}

        {/* Кнопки: В корзину и (i) */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>В корзину</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton} onPress={showCharacteristics}>
            <Text style={styles.infoButtonText}>ⓘ</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 10,
  },
  tagsContainer: {
    position: 'absolute',
    top: 30,
    left: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 5,
  },
  tagChip: {
    backgroundColor: 'rgba(98, 0, 238, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#1a1a1a',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6200ee',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginTop: 12,
  },
  sizesContainer: {
    marginTop: 16,
  },
  sizesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sizesList: {
    paddingVertical: 4,
  },
  sizeItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sizeItemActive: {
    borderColor: '#6200ee',
    backgroundColor: '#6200ee',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  sizeTextActive: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoButtonText: {
    fontSize: 20,
    color: '#333',
  },
});

export default ProductBottomSheet;