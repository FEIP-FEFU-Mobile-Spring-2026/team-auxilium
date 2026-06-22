import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';

const ProductBottomSheet = ({ product, onClose }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

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
        <Text style={styles.description}>{product.longDescription}</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

// Стили остаются без изменений
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
    marginTop: 16,
  },
});

export default ProductBottomSheet;