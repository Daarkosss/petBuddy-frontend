import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { Notification } from "../types/notification.types";

class NotificationStore {
  unread: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchNotifications() {
    api.getNotifications().then((notifications) => {
      if (notifications) {
        this.unread = notifications.content;
      }
    })
  }

  addNotification(notification: Notification) {
    this.unread.push(notification);
  }

  reset() {
    this.unread = [];
  }
}

export default NotificationStore;
