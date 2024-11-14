import { Client, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client";
import store from "../store/RootStore";
import { PATH_PREFIX } from "./api";
import { toast } from "react-toastify";

class NotificationWebSocket {
  private wsClient: Client | null = null;

  initWebsocketConnection = () => {
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

    console.log("subscribing to a session");
    this.wsClient.subscribe(
      "/user/topic/notification",
      (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage);
        toast.info("New notification has appeared");
      }
    );
  };
}

export default NotificationWebSocket;