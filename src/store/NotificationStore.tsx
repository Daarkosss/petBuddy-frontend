import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { Notification } from "../types/notification.types";

class NotificationStore {
  notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchNotifications() {
    api.getNotifications().then((notifications) => {
      if (notifications) {
        this.notifications = notifications.content;
      }
    })
  }

  reset() {
    this.notifications = [];
  }
}

export default NotificationStore;
