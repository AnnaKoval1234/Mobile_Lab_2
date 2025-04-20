import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ImagePickerResult, launchImageLibraryAsync } from 'expo-image-picker';
import { MarkerData, ImageData } from '../../types';
import  ImageList  from '@/components/ImageList';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function MarkerDetailScreen() {

  const { id } = useLocalSearchParams();
  const db = useDatabase();
  const [images, setImages] = useState<ImageData[]>([]);
  const [marker, setMarker] = useState<MarkerData>();
  const [isLoading, setIsLoading] = useState(true);
  
  const loadImages = async () => {
    try {
      await db.getMarkerImages(Number(id))
              .then(setImages);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить изображения');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarker = async () => {
    try {
      const markers = await db.getMarkers();
      const foundMarker = markers.find(m => m.id === Number(id));
      if (foundMarker) {
          setMarker(foundMarker);
      }
    } catch (error) {
      console.error('Ошибка при загрузке маркера:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить детали маркера');
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      loadMarker();
      loadImages();
    }, []);

  const addImage = async () => {
    try {
      const result: ImagePickerResult = await launchImageLibraryAsync();
      if (!result.canceled) {
        await db.addImage(Number(id), result.assets[0].uri);
        await loadImages();
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение.');
    }
  };

  const deleteImage = async (image: ImageData) => {
    try {
      await db.deleteImage(image.id);
      await loadImages();
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      Alert.alert('Ошибка', 'Не удалось удалить изображение.');
    }
  };

  const handleDeleteMarker = async () => {
    try {
      await db.deleteMarker(Number(id))
              .then(() => router.back());
    } catch (error) {
      console.error('Ошибка при удалении маркера:', error);
      Alert.alert('Ошибка', 'Не удалось удалить маркер.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageList images={images!} onDelete={deleteImage}/>
      <Button title="Добавить изображение" onPress={addImage}/>
      <Button title="Удалить маркер" onPress={() => handleDeleteMarker()} color="#dc3545"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    textAlign: 'center',
  }
});
