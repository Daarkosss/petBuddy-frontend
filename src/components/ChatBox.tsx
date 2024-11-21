import React, { useEffect, useRef, useState } from "react";
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
import ChatMinimized from "./ChatMinimized";

interface ChatBoxProperties {
  recipientEmail: string;
  profilePicture: string | null;
  onClose: Function;
  name: string;
  surname: string;
  profile: string;
}

const ChatBox: React.FC<ChatBoxProperties> = ({
  recipientEmail,
  profilePicture,
  onClose,
  name,
  surname,
  profile,
}) => {
  const [wsClient, setWsClient] = useState<Client | null>(null);
  const [doesChatRoomExist, setDoesChatRoomExist] = useState<boolean | null>(
    null
  );
  const [chatRoomData, setChatRoomData] = useState<ChatRoom | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef(messages);
  const [lastSeenMessage, setLastSeenMessage] = useState<number | undefined>();

  const [minimized, setMinimized] = useState<boolean>(false);

  //TODO: is it ok to create it in ChatBox?
  useEffect(() => {
    initWebsocketConnection();
    return () => {
      disconnectWebSocket();
    };
  }, []);

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

  useEffect(() => {
    if (
      wsClient !== null &&
      store.user.profile !== null &&
      store.user.profile?.selected_profile !== null
    ) {
      checkIfChatRoomExists();
    }
  }, [wsClient, store.user.profile?.selected_profile]);

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

  useEffect(() => {
    if (doesChatRoomExist == true && chatId != null) {
      getMessages();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [doesChatRoomExist, chatId]);

  useEffect(() => {
    console.log(`messages have changed to: ${JSON.stringify(messages)}`);
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    console.log(`chatId: ${chatId}`);
    if (chatId != null) {
      subscribeToChatRoom();
    }
  }, [chatId]);

  const subscribeToChatRoom = () => {
    if (wsClient === null) {
      console.log("not subscribing to chat room");
      return;
    }
    console.log("subscribing to chat room");
    const headers = {
      "Accept-Role":
        store.user.profile?.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": "Europe/Warsaw", //TODO: change for correct timezone
    };

    wsClient.subscribe(
      `/user/topic/messages/${chatId}`,
      (message) => {
        console.log(JSON.parse(message.body));
        const data: WebsocketResponse = JSON.parse(message.body);
        if (data.type === "SEND") {
          if (
            (data.content.senderEmail === store.user.profile?.email &&
              data.content.seenByRecipient === true) ||
            data.content.senderEmail !== store.user.profile?.email
          ) {
            if (data.content.seenByRecipient === true) {
              setLastSeenMessage(data.content.id);
            }
          }
          setMessages((prevMessages) => [...prevMessages, data.content]);
        } else {
          if (data.type === "JOIN") {
            if (data.joiningUserEmail !== store.user.profile?.email) {
              setLastSeenMessageToLastMessage();
            }
          }
        }
      },
      headers
    );
  };

  const setLastSeenMessageToLastMessage = () => {
    console.log("set to last");
    if (messagesRef.current.length > 0) {
      console.log("yes it is setting");
      setLastSeenMessage(
        messagesRef.current[messagesRef.current.length - 1].id
      );
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
    setLastSeenMessage(
      messagesResponse.content.find(
        (message) => message.seenByRecipient === true
      )?.id
    );
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

  const sendMessageToChatRoom = (message: string) => {
    // Accept-Role - required header
    // Accept-Timezone - optional header (overrides cached timezone in the backend)
    const headers = {
      "Accept-Role":
        store.user.profile!.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": "Asia/Tokyo", //TODO: popraw
    };
    if (wsClient && message) {
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
  };

  return minimized === false ? (
    <div className="chat-box-main-container-wrap">
      <div className="chat-box-main-container">
        {doesChatRoomExist != null && (
          <div className="chat-box-inner-container">
            <ChatTopBar
              onClose={() => onClose()}
              profilePicture={profilePicture}
              name={name}
              surname={surname}
              profile={profile}
              onMinimize={() => setMinimized(true)}
            />
            <ChatMessages
              messages={messages}
              recipientName={name}
              recipientSurname={surname}
              lastSeenMessageId={lastSeenMessage}
            />
            <ChatBottom onSend={onSend} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="chat-box-main-container-wrap">
      <div className="chat-box-main-container">
        <ChatMinimized name={name} surname={surname} profile={profile} />
      </div>
    </div>
  ); //add on click and maximize then, also add
};

export default ChatBox;
