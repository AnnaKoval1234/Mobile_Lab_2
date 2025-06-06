import * as Location from 'expo-location';

export interface MarkerData {
    id: number;
    latitude: number;
    longitude: number;
    // images: ImageData[];
}

export interface ImageData {
    id: number;
    marker_id: number;
    uri: string;
}

export interface LocationConfig {
  accuracy: Location.Accuracy;
  timeInterval: number;  // Как часто обновлять местоположение (мс)
  distanceInterval: number;  // Минимальное расстояние (в метрах) между обновлениями
}

export interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
}

export interface ActiveNotification {
  markerId: number;
  notificationId: string;
  timestamp: number;
}

