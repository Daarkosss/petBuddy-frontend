import React, { useEffect, useState } from "react";
import ChatTopBar from "./ChatTopBar";
import ChatMessages from "./ChatMessages";
import ChatBottom from "./ChatBottom";
import "../scss/components/_chatBox.scss";
import { Client, IFrame, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client/dist/sockjs";
import store from "../store/RootStore";
import { api } from "../api/api";
import { ChatRoom } from "../types/chat.types";

interface ChatBoxProperties {
  recipientEmail: string;
}

const ChatBox: React.FC<ChatBoxProperties> = ({ recipientEmail }) => {
  const [wsClient, setWsClient] = useState<Client | null>(null);
  const [message, setMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [doesChatRoomExist, setDoesChatRoomExist] = useState<boolean | null>(
    null
  );
  const [chatRoomData, setChatRoomData] = useState<ChatRoom | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);

  //TODO: is it ok to create it in ChatBox?
  useEffect(() => {
    initWebsocketConnection();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    subscribeToSession();
  }, [wsClient]);

  useEffect(() => {
    checkIfChatRoomExists();
  }, [wsClient, store.user.profile]);

  useEffect(() => {
    console.log(`chatId: ${chatId}`);
    subscribeToChatRoom();
  }, [sessionId, chatId]);

  //TODO: implement this
  const checkIfChatRoomExists = async () => {
    try {
      const data = await api.getChatRoomWithGivenUser(
        recipientEmail,
        "Europe/Warsaw"
      );
      setChatRoomData(data);
      setChatId(data.id);
      setDoesChatRoomExist(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const regex = /Status code: ([0-9]{3})/;
        const match = error.message.match(regex);
        if (match != null && match[1] === "404") {
          setDoesChatRoomExist(false);
        }
        console.log(`error message: ${error.message}, match: ${match![1]}`);
      }
    }
  };

  const getMessages = () => {
    return;
  };

  //TODO: timezone
  const initializeChatRoom = (message: string) => {
    api.initializeChatRoom(recipientEmail, message, "Europe/Warsaw");
  };

  const initWebsocketConnection = () => {
    const socket = new sockjs(
      `http://localhost:8081/ws?token=${store.user.jwtToken}`
    );
    const client = Stomp.over(() => socket);
    const onConnect = (frame: IFrame) => {
      setWsClient(client);
    };
    client.connect({}, onConnect);
  };

  const subscribeToSession = () => {
    if (wsClient === null) {
      return;
    }

    wsClient.subscribe(
      `/topic/session/${store.user.profile?.email}`,
      (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("SESSION ID", parsedMessage.sessionId);
        setSessionId(parsedMessage.sessionId);
      }
    );
  };

  const subscribeToChatRoom = () => {
    if (sessionId === undefined || wsClient === null) {
      return;
    }
    // Accept-Role - required header
    // Accept-Timezone - optional header (caches initial timezone in the backend)
    const headers = {
      "Accept-Role":
        store.user.profile!.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": "Europe/Warsaw",
    };
    wsClient.subscribe(
      `/topic/messages/${chatId}/${sessionId}`,
      (message) => {
        console.log("Join message", message.body);
        setMessage(message.body);
      },
      headers
    );
  };

  const sendMessageToChatRoom = (message: string) => {
    // Accept-Role - required header
    // Accept-Timezone - optional header (overrides cached timezone in the backend)
    const headers = {
      "Accept-Role":
        store.user.profile!.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": "Asia/Tokyo",
    };
    if (wsClient && message && sessionId) {
      const chatMessage = { content: message };
      wsClient.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify(chatMessage),
        headers: headers,
      });
      setInputMessage("");
    }
  };

  const disconnectWebSocket = () => {
    if (wsClient) {
      wsClient.deactivate().then(() => {
        console.log("Disconnected");
      });
    }
  };

  const getCookieNative = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  // const mockupMessages = [
  //   {
  //     id: 1,
  //     chatId: 1,
  //     senderEmail: "kuba.staniszewski.ks@gmail.com",
  //     content: "Hello",
  //     createdAt: "2024-10-12T11:44:26.078Z",
  //     seenByRecipient: true,
  //   },
  //   {
  //     id: 2,
  //     chatId: 1,
  //     senderEmail: "test@gmail.com",
  //     content: "Hello there!",
  //     createdAt: "2024-10-12T11:45:26.078Z",
  //     seenByRecipient: true,
  //   },
  // ];

  const onSend = (input: string) => {
    if (doesChatRoomExist == false) {
      initializeChatRoom(input);
    } else if (doesChatRoomExist == true) {
      sendMessageToChatRoom(input);
    }
  };

  return (
    <div className="chat-box-main-container">
      {doesChatRoomExist != null && (
        <div className="chat-box-inner-container">
          <ChatTopBar />
          <ChatMessages messages={mockupMessages} />
          <ChatBottom onSend={onSend} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
