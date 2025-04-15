import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { MarkerData } from '@/types';
import MarkerList from '@/components/MarkerList';
import { MarkerContext } from '@/contexts/MarkerContext';
import { useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

export default function Index() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const db = useDatabase();
  const state = useContext(MarkerContext);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!db.isLoading) {
  //       loadMarkers();
  //     }
  //   }, [db.isLoading])
  // );

  const loadMarkers = async () => {
    try {
      const result = await db.getMarkers();
      setMarkers(result);
    } catch (error) {
      console.error('Ошибка при загрузке маркеров:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры');
    }
  };


  const handleLongPress =  async (event: LongPressEvent) => {

    try {
      console.log(markers)
      const {coordinate}  = event.nativeEvent;
  
      db.addMarker(coordinate.latitude, coordinate.longitude);
      loadMarkers();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить метку. Попробуйте снова.');
    }
  };





  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 58.00,
          longitude: 56.19,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleLongPress}>
          <MarkerList
            markers={markers}
            onMarkerPress={(m) => router.push({pathname: "/marker/[id]", params: { id: m.id }})}>
          </MarkerList>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
