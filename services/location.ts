import { LocationConfig } from '@/types';
import * as Location from 'expo-location';
import {getDistance} from "geolib";

export const config: LocationConfig = {
  accuracy: Location.Accuracy.High,
  timeInterval: 5000,
  distanceInterval: 10,
}

export const requestLocationPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Доступ к местоположению не разрешён');
  }
};

export const startLocationUpdates = async (
  onLocation: (location: Location.LocationObject) => void
): Promise<Location.LocationSubscription> => {
  return await Location.watchPositionAsync(
    config,
    onLocation
  );
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  return getDistance(
        {latitude: lat1, longitude: lon1},
        {latitude: lat2, longitude: lon2}
    );
};

