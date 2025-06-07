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

export interface ActiveNotification {
  markerId: number; // ссылка на маркер
  notificationId: string; // ссылка на уведомление
  timestamp: number; // время
}

