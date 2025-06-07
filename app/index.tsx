import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Circle, LongPressEvent } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { MarkerData } from '@/types';
import MarkerList from '@/components/MarkerList';
import { useDatabase } from '@/contexts/DatabaseContext';
import * as Location from "expo-location";
import * as Notifications from "expo-notifications"
import { calculateDistance, requestLocationPermissions, startLocationUpdates } from '@/services/location';
import { MyNotificationManager } from '@/services/notifications';

export default function Index() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const db = useDatabase();

  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords> ({
    latitude: 0,
    longitude: 0
  } as Location.LocationObjectCoords);
  const PROXIMITY_THRESHOLD = 300;


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

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const setupLocation = async () => {
      try {
        await requestLocationPermissions();
        locationSubscription = await startLocationUpdates((location) => {
          setUserLocation(location.coords); // Обновить состояние местоположения
        });
      } catch (error) {
        console.error("Ошибка геолокации: ", error);
      }
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    MyNotificationManager.requestNotificationPermissions();

    setupLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    checkProximity();
  }, [userLocation]);

  const checkProximity = () => {
    markers.forEach(async marker => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        marker.latitude,
        marker.longitude
      );


      if (distance <= PROXIMITY_THRESHOLD) {
        await MyNotificationManager.showNotification(marker);
      } else {
        await MyNotificationManager.removeNotification(marker);
      }
    });
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
        showsUserLocation={true}
        onLongPress={handleLongPress}>
        {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={PROXIMITY_THRESHOLD}
                        strokeColor='#FF3B30'
                    />
                )}
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
