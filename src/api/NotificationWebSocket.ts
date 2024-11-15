import { Client, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client";
import i18next from "i18next";
import store from "../store/RootStore";
import { PATH_PREFIX } from "./api";
import { toast } from "react-toastify";
import { Notification } from "../types/notification.types";

class NotificationWebSocket {
  private wsClient: Client | null = null;

  initWebsocketConnection = () => {
    this.disconnectWebSocket();

    const socket = new sockjs(
      `${PATH_PREFIX}ws?token=${store.user.jwtToken}`
    );
    const client = Stomp.over(() => socket);
    const onConnect = () => {
      this.wsClient = client;
      console.log("WS client connected");
      this.subscribeToSession();
    };
    client.connect({}, onConnect);
  };

  subscribeToSession = () => {
    if (!this.wsClient) {
      return;
    }

    this.wsClient.subscribe(
      "/user/topic/notification",
      (message) => {
        const newNotification: Notification = JSON.parse(message.body);
        store.notification.addNotification(newNotification);
        toast.info(i18next.t("notification.newNotification"));
      }
    );
  };

  disconnectWebSocket = () => {
    if (this.wsClient) {
      this.wsClient.deactivate();
    }
  };
}

export default NotificationWebSocket;