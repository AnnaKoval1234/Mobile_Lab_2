import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ImagePickerResult, launchImageLibraryAsync } from 'expo-image-picker';
import { MarkerData, ImageData } from '../../types';
import { MarkerContext } from '@/contexts/MarkerContext';
import  ImageList  from '@/components/ImageList';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function MarkerDetailScreen() {

  const { id } = useLocalSearchParams();
  const state = useContext(MarkerContext);
  const db = useDatabase();
  const [images, setImages] = useState<ImageData[]>();
  const [isLoading, setIsLoading] = useState(true);
  
  const loadImages = async () => {
    try {
      const markerImages = await db.getMarkerImages(Number(id));
      setImages(markerImages);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить изображения');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = async () => {
    try {
      const result: ImagePickerResult = await launchImageLibraryAsync();
      if (!result.canceled) {
        await db.addImage(Number(id), result.assets[0].uri);
        await loadImages();
        
        // const updatedMarker: MarkerData = {
        //     ...foundMarker!,
        //     images: [...foundMarker!.images, image],
        // };

        // state.setMarkers(prevMarkers => prevMarkers.map(marker => marker.id === id ? updatedMarker : marker));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать изображение.');
    }
  };

  const deleteImage = async (i: ImageData) => {
    await db.deleteImage(Number(id));
    await loadImages();
    // const updatedMarker: MarkerData = {
    //   ...foundMarker!,
    //   images: foundMarker!.images.filter(image => image.id !== i.id),
    // };

    // state.setMarkers(prevMarkers => prevMarkers.map(marker => marker.id === id ? updatedMarker : marker));
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Широта: {foundMarker?.coordinate.latitude.toFixed(2)}    Долгота: {foundMarker?.coordinate.longitude.toFixed(2)}</Text> */}
      <ImageList images={images!} onDelete={deleteImage}/>
      <Button title="Добавить изображение" onPress={addImage}/>
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
