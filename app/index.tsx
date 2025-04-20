import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { MarkerData } from '@/types';
import MarkerList from '@/components/MarkerList';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function Index() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const db = useDatabase();

  const loadMarkers = async () => {
    try {
      const result = await db.getMarkers();
      console.log(result)
      setMarkers(result);
    } catch (error) {
      console.error('Ошибка при загрузке маркеров:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!db.isLoading) {
        loadMarkers();
      }
    }, [db.isLoading])
  );

  const handleLongPress =  async (event: LongPressEvent) => {
    try {
      const {coordinate}  = event.nativeEvent;
      await db.addMarker(coordinate.latitude, coordinate.longitude);
      await loadMarkers();
    } catch (error) {
      console.error('Ошибка при добавлении маркеров:', error);
      Alert.alert('Ошибка', 'Не удалось добавить маркер.');
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
            onMarkerPress={(m) => {
              try {
                router.push({pathname: "/marker/[id]", params: { id: m.id }})
              } catch (error) {
                console.error('Ошибка при открытии деталей маркера:', error);
                Alert.alert('Ошибка', 'Не удалось открыть детали маркера.');
              }
            }}>
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
