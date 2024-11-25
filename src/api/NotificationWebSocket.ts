import { Client, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client";
import i18next from "i18next";
import store from "../store/RootStore";
import { PATH_PREFIX } from "./api";
import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";

class NotificationWebSocket {
  private wsClient: Client | null = null;
  receiveNewMessageTrigger: boolean = false;

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

  changeReceiveMessagetriggerValue = () => {
    //to trigger chatBadge load chat rooms with newest data
    this.receiveNewMessageTrigger = !this.receiveNewMessageTrigger;
  };

  subscribeToSession = () => {
    if (!this.wsClient || !store.user.profile?.selected_profile) {
      return;
    }

    this.wsClient.subscribe("/user/topic/notification", (message) => {
      const newNotification = JSON.parse(message.body);
      console.log(`Nowa wiadomość ${JSON.stringify(newNotification)} dd`);
      if (
        newNotification.receiverProfile === store.user.profile?.selected_profile
      ) {
        store.notification.addNotification(newNotification);
        toast.info(i18next.t("notification.newNotification"));
      }

      if (newNotification.dType === "CHAT_NOTIFICATION") {
        this.changeReceiveMessagetriggerValue();
        store.notification.setunreadChats(
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
