import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { Notification } from "../types/notification.types";
import store from "../store/RootStore";

class NotificationStore {
  all: Notification[] = [];
  unreadChats: number = 0;
  openCareId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get unread() {
    return this.all.filter((notif) => !notif.read);
  }

  get read() {
    return this.all.filter((notif) => notif.read);
  }

  async setup() {
    await this.fetchNotifications();
    await this.fetchNumberOfUnreadChats();
    api.connectNotificationWebSocket();
  }

  async fetchNotifications() {
    try {
      const notifications = await api.getNotifications();
      if (notifications) {
        this.all = notifications.content;
      }
    } catch (error) {
      console.error("Error while fetching notifications");
    }
  }

  async fetchNumberOfUnreadChats() {
    try {
      const numberOfUnreadChats = await api.getNumberOfUnreadChats();
      if (numberOfUnreadChats !== undefined) {
        this.unreadChats = numberOfUnreadChats;
      }
    } catch (error) {
      console.error("Error while fetching number of unread chats");
    }
  }

  setUnreadChats(unseenChatsAsClient: number, unseenChatsAsCaretaker: number) {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      this.unreadChats = unseenChatsAsCaretaker;
    }

    if (store.user.profile?.selected_profile === "CLIENT") {
      this.unreadChats = unseenChatsAsClient;
    }
  }

  addNotification(notification: Notification) {
    if (
      notification.objectType === "CARE" &&
      notification.objectId === this.openCareId
    ) {
      location.reload();
    } else {
      this.all.unshift(notification);
    }
  }

  markAllAsRead() {
    try {
      api.markAllNotificationsAsRead();
      this.all = this.all.map((notif) => ({ 
        ...notif, 
        read: true 
      }));
    } catch (error) {
      console.error("Error");
    }
  }

  markCareNotificationsAsRead(careId: number) {
    const careNotificationIds = this.getCareNotifications(careId);
    try {
      careNotificationIds.map((notifId) => {
        try {
          api.markNotificationAsRead(notifId);
        } catch (error) {
          console.error(
            `Failed to mark notification ${notifId} as read`,
            error
          );
        }
      });
      this.all = this.all.map((notif) => {
        if (careNotificationIds.includes(notif.notificationId)) {
          return { ...notif, read: true };
        } else {
          return notif;
        }
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while marking notifications as read"
      );
    }
  }

  getCareNotifications(careId: number) {
    return this.all
      .filter(
        (notif) => notif.objectType === "CARE" && notif.objectId === careId
      )
      .map((notif) => notif.notificationId);
  }

  reset() {
    this.all = [];
  }
}

export default NotificationStore;
