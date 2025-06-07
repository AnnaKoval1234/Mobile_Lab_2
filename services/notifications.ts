import { ActiveNotification, MarkerData } from '@/types';
import * as Notifications from 'expo-notifications';

class NotificationManager {
  private activeNotifications: Map<number, ActiveNotification>;

  constructor() {
    this.activeNotifications = new Map();
  }

  async requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Уведомления не разрешены');
    }
  }

  async showNotification(marker: MarkerData): Promise<void> {
    if (this.activeNotifications.has(marker.id)) {
      return; // Предотвращаем дубликаты
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Вы рядом с меткой!",
        body: `Вы находитесь рядом с сохранённой точкой.`,
      },
      trigger: null // Уведомление отправляется сразу
    });

    this.activeNotifications.set(marker.id, {
      markerId: marker.id,
      notificationId,
      timestamp: Date.now()
    });
  }

  async removeNotification(marker: MarkerData): Promise<void> {
    const notification = this.activeNotifications.get(marker.id);
    if (notification) {
      await Notifications.dismissNotificationAsync(notification.notificationId)
      this.activeNotifications.delete(marker.id);
    } 
  }

  clearAll() {
    this.activeNotifications.forEach(async (id) => {
      await Notifications.cancelScheduledNotificationAsync(id.notificationId);
    });
    this.activeNotifications.clear();
  }
}

export const MyNotificationManager = new NotificationManager();
