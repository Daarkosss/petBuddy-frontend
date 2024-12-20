import { Client, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client";
import i18next from "i18next";
import store from "../store/RootStore";
import { PATH_PREFIX } from "./api";
import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";

class NotificationWebSocket {
  private wsClient: Client | null = null;
  newMessageTrigger: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  initWebsocketConnection = () => {
    this.disconnectWebSocket();

    const socket = new sockjs(`${PATH_PREFIX}ws?token=${store.user.jwtToken}`);
    const client = Stomp.over(() => socket);
    const onConnect = () => {
      this.wsClient = client;
      this.subscribeToSession();
    };
    client.connect({}, onConnect);
  };

  changeNewMessageTriggerValue = () => {
    //to trigger chatBadge load chat rooms with newest data
    this.newMessageTrigger = !this.newMessageTrigger;
  };

  subscribeToSession = () => {
    if (!this.wsClient) {
      return;
    }

    this.wsClient.subscribe("/user/topic/notification", (message) => {
      const newNotification = JSON.parse(message.body);
      if (
        newNotification.receiverProfile === store.user.profile?.selected_profile
      ) {
        store.notification.addNotification(newNotification);
        toast.info(i18next.t("notification.newNotification"));
      }

      if (newNotification.dType === "CHAT_NOTIFICATION") {
        this.changeNewMessageTriggerValue();
        store.notification.setUnreadChats(
          newNotification.unseenChatsAsClient,
          newNotification.unseenChatsAsCaretaker
        );
      }
    });
  };

  disconnectWebSocket = () => {
    if (this.wsClient) {
      this.wsClient.deactivate();
    }
  };
}

export default NotificationWebSocket;
