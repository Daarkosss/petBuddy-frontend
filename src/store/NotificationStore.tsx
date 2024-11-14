import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { Notification } from "../types/notification.types";

class NotificationStore {
  unread: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchNotifications() {
    try {
      const notifications = await api.getNotifications();
      if (notifications) {
        this.unread = notifications.content;
        console.log(this.unread);
      }
    } catch(error) {
      console.error("Error while fetching notifications");
    } finally {
      console.log(this.unread);
    }
  }

  addNotification(notification: Notification) {
    this.unread.push(notification);
  }

  async markAllAsRead() {
    try {
      console.log("XD")
      api.markAllNotificationsAsRead();
      this.reset()
    } catch(error) {
      console.error("Error")
    }
  }

  async markCareNotificationsAsRead(careId: number) {
    const careNotificationIds = this.getCareNotifications(careId);
    console.log(careNotificationIds);
  
    try {
      const deletedNotifications = await Promise.all(
        careNotificationIds.map(async (notifId) => {
          try {
            return await api.markNotificationAsRead(notifId);
          } catch (error) {
            console.error(`Failed to mark notification ${notifId} as read`, error);
            return null;
          }
        })
      );
  
      deletedNotifications
        .filter((notif) => notif !== null)
        .forEach((deletedNotif) => {
          if (deletedNotif) {
            this.removeNotification(deletedNotif.notificationId);
          }
        });
    } catch (error) {
      throw new Error("Something went wrong while marking notifications as read.");
    } finally {
      console.log(this.unread.length);
    }
  }

  removeNotification(notificationId: number) {
    this.unread = this.unread.filter((notif) => notif.notificationId !== notificationId);
  }
  
  getCareNotifications(careId: number) {
    return this.unread
      .filter((notif) => notif.objectType === "CARE" && notif.objectId === careId)
      .map((notif) => notif.notificationId);
  }

  reset() {
    this.unread = [];
  }
}

export default NotificationStore;
