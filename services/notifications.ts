import { ActiveNotification, MarkerData } from '@/types';
import * as Notifications from 'expo-notifications';

class NotificationManagerImpl {
  private activeNotifications: Map<number, ActiveNotification>;

  constructor() {
    this.activeNotifications = new Map();
    console.log("Я родился")
  }

  async requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Уведомления не разрешены');
    }
  }

  async showNotification(marker: MarkerData): Promise<void> {
    if (this.activeNotifications.has(marker.id)) {
      console.log("Дубликат")
      return; // Предотвращаем дубликаты
    }

    console.log("Уведомление")

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

  async removeNotification(markerId: number): Promise<void> {
    const notification = this.activeNotifications.get(markerId);
    if (notification) {
      console.log("Потрачено")
      // await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
      await Notifications.dismissNotificationAsync(notification.notificationId)
      this.activeNotifications.delete(markerId);
    } else {
      console.log("Не потрачено")
    }
  }


  clearAll() {
    this.activeNotifications.forEach(async (id) => {
      await Notifications.cancelScheduledNotificationAsync(id.notificationId);
    });
    this.activeNotifications.clear();
  }
}

export const NotificationManager = new NotificationManagerImpl();
