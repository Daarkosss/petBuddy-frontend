import React, { useEffect, useState } from "react";
import ChatTopBar from "./ChatTopBar";
import ChatMessages from "./ChatMessages";
import ChatBottom from "./ChatBottom";
import "../scss/components/_chatBox.scss";
import { Client, IFrame, Stomp } from "@stomp/stompjs";
import sockjs from "sockjs-client/dist/sockjs";
import store from "../store/RootStore";
import { api } from "../api/api";
import { ChatMessage, ChatRoom, WebsocketResponse } from "../types/chat.types";
import { json } from "react-router-dom";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  //TODO: is it ok to create it in ChatBox?
  useEffect(() => {
    initWebsocketConnection();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (wsClient != null) {
      subscribeToSession();
    }
  }, [wsClient]);

  useEffect(() => {
    if (
      wsClient != null &&
      store.user.profile != null &&
      store.user.profile?.selected_profile != null
    ) {
      checkIfChatRoomExists();
    }
  }, [wsClient, store.user.profile?.selected_profile]);

  useEffect(() => {
    console.log(`chatId: ${chatId}`);
    if (sessionId != null && chatId != null) {
      subscribeToChatRoom();
    }
  }, [sessionId, chatId]);

  useEffect(() => {
    if (doesChatRoomExist == true && chatId != null) {
      getMessages();
    }
  }, [doesChatRoomExist, chatId]);

  //TODO: implement this
  const checkIfChatRoomExists = async () => {
    console.log("checking if chat room exists");
    try {
      const data = await api.getChatRoomWithGivenUser(
        recipientEmail,
        "Europe/Warsaw"
      );
      setChatRoomData(data);
      setChatId(data.id);
      setDoesChatRoomExist(true);
      console.log(`chat room exists: ${chatRoomData}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const regex = /Status code: ([0-9]{3})/;
        const match = error.message.match(regex);
        if (match != null && match[1] === "404") {
          setDoesChatRoomExist(false);
          console.log("chat does not exist");
        }
        console.log(`error message: ${error.message}, match: ${match![1]}`);
      }
    }
  };

  const getMessages = async () => {
    console.log("getting messages");
    const messagesResponse = await api.getMessagesFromSpecifiedChatRoom(
      chatId!,
      "0",
      "10",
      "Europe/Warsaw"
    );
    console.log(`Messages: ${messagesResponse.content}`);
    setMessages([...messagesResponse.content].reverse());
  };

  //TODO: timezone
  const initializeChatRoom = async (message: string) => {
    console.log("initializing chat room");
    await api.initializeChatRoom(recipientEmail, message, "Europe/Warsaw");
    setDoesChatRoomExist(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: 1,
        chatId: chatId!,
        senderEmail: store.user.profile!.email!,
        content: message,
        createdAt: new Date().toISOString(),
        seenByRecipient: false,
      },
    ]);
  };

  const initWebsocketConnection = () => {
    const socket = new sockjs(
      `http://localhost:8081/ws?token=${store.user.jwtToken}`
    );
    const client = Stomp.over(() => socket);
    const onConnect = (frame: IFrame) => {
      setWsClient(client);
      console.log("WS client connected");
    };
    client.connect({}, onConnect);
  };

  const subscribeToSession = () => {
    if (wsClient === null) {
      return;
    }
    console.log("subscribing to a session");
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
    // console.log(`subscribe to chat room parameters: ${sessionId}, ${wsClient}`);
    if (sessionId === undefined || wsClient === null) {
      console.log("not subscribing to chat room");
      return;
    }
    console.log("subscribing to chat room");
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
        console.log(JSON.parse(message.body));
        const data: WebsocketResponse = JSON.parse(message.body);
        if (data.type === "SEND" || data.type === "SEND") {
          // setMessages([...messages, data.content]);
          setMessages((prevMessages) => [...prevMessages, data.content]);
        } else {
          if (data.type === "JOIN") {
            console.log("Join message", data.content);
          }
        }
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
      console.log(`Sending... ${chatId}, ${chatMessage}`);
      wsClient.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify(chatMessage),
        headers: headers,
      });
    } else console.log("sending message ended without sending message");
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
    console.log(`sending while does chat room exist: ${doesChatRoomExist}`);
    if (doesChatRoomExist == false) {
      try {
        initializeChatRoom(input);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to initialize chat room: ${error.message}`);
        }
        throw new Error(
          "An unknown error occurred while initializing chat room"
        );
      }
    } else if (doesChatRoomExist == true) {
      sendMessageToChatRoom(input);
    }
    // console.log(`previous messages: ${JSON.stringify(messages)}`);
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     id:
    //       prevMessages.length > 0
    //         ? prevMessages[prevMessages.length - 1].id + 1
    //         : 1,
    //     chatId: chatId!,
    //     senderEmail: store.user.profile!.email!,
    //     content: input,
    //     createdAt: new Date().toISOString(),
    //     seenByRecipient: false,
    //   },
    // ]);
    // console.log(`new messages: ${JSON.stringify(messages)}`);
  };

  return (
    <div className="chat-box-main-container">
      {doesChatRoomExist != null && (
        <div className="chat-box-inner-container">
          <ChatTopBar />
          <ChatMessages messages={messages} />
          <ChatBottom onSend={onSend} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
