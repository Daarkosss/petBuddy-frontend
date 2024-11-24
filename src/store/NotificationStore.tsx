import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { Notification } from "../types/notification.types";
import store from "../store/RootStore";

class NotificationStore {
  unread: Notification[] = [];
  unreadChats: number = 0;
  openCareId: number | null = null;

  constructor() {
    makeAutoObservable(this);
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
        this.unread = notifications.content;
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

  setunreadChats(unseenChatsAsClient: number, unseenChatsAsCaretaker: number) {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      this.unreadChats = unseenChatsAsCaretaker;
    }

    if (store.user.profile?.selected_profile === "CLIENT") {
      console.log(
        `setting unseen chat messages as client to: ${unseenChatsAsClient}`
      );
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
      this.unread.unshift(notification);
    }
  }

  async markAllAsRead() {
    try {
      await api.markAllNotificationsAsRead();
      this.reset();
    } catch (error) {
      console.error("Error");
    }
  }

  async markCareNotificationsAsRead(careId: number) {
    const careNotificationIds = this.getCareNotifications(careId);
    try {
      const deletedNotifications = await Promise.all(
        careNotificationIds.map(async (notifId) => {
          try {
            return await api.markNotificationAsRead(notifId);
          } catch (error) {
            console.error(
              `Failed to mark notification ${notifId} as read`,
              error
            );
            return null;
          }
        })
      );

      this.removeNotifications(
        deletedNotifications.map((notif) => notif!.notificationId)
      );
    } catch (error) {
      throw new Error(
        "Something went wrong while marking notifications as read"
      );
    } finally {
      console.log(this.unread.length);
    }
  }

  removeNotifications(notificationIds: number[]) {
    this.unread = this.unread.filter(
      (notif) => !notificationIds.includes(notif.notificationId)
    );
  }

  getCareNotifications(careId: number) {
    return this.unread
      .filter(
        (notif) => notif.objectType === "CARE" && notif.objectId === careId
      )
      .map((notif) => notif.notificationId);
  }

  reset() {
    this.unread = [];
  }
}

export default NotificationStore;
