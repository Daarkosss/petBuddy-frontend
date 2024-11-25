import React, { useEffect, useRef, useState } from "react";
import ChatTopBar from "./ChatTopBar";
import ChatMessages from "./ChatMessages";
import ChatBottom from "./ChatBottom";
import "../scss/components/_chatBox.scss";
import { Client, Stomp } from "@stomp/stompjs";
import sockJS from "sockjs-client";
import store from "../store/RootStore";
import { api, PATH_PREFIX } from "../api/api";
import { ChatMessage, WebsocketResponse } from "../types/chat.types";

interface ChatBoxProperties {
  recipientEmail: string;
  profilePicture: string | null;
  onClose: () => void;
  onMinimize: () => void;
  name: string;
  surname: string;
  profile: string;
}

const ChatBox: React.FC<ChatBoxProperties> = ({
  recipientEmail,
  profilePicture,
  onClose,
  onMinimize,
  name,
  surname,
  profile,
}) => {
  const [wsClient, setWsClient] = useState<Client | null>(null);
  const [doesChatRoomExist, setDoesChatRoomExist] = useState<boolean | null>(
    null
  );
  const wsClientRef = useRef(wsClient);
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef(messages);
  const [lastSeenMessage, setLastSeenMessage] = useState<number | undefined>();
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  useEffect(() => {
    wsClientRef.current = wsClient;
  }, [wsClient]);
  useEffect(() => {
    initWebsocketConnection();
    return () => {
      disconnectWebSocket();
    };
  }, [recipientEmail]); //to change, when chat with other recipient selected

  const initWebsocketConnection = () => {
    const socket = new sockJS(`${PATH_PREFIX}ws?token=${store.user.jwtToken}`);
    const client = Stomp.over(() => socket);
    const onConnect = () => {
      setWsClient(client);
      console.log("WS client connected");
    };
    client.connect({}, onConnect);
  };

  useEffect(() => {
    if (
      wsClient && store.user.profile && store.user.profile?.selected_profile
    ) {
      checkIfChatRoomExists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsClient, store.user.profile?.selected_profile]);

  const checkIfChatRoomExists = async () => {
    try {
      const data = await api.getChatRoomWithGivenUser(recipientEmail, timeZone);
      setChatId(data.id);
      setDoesChatRoomExist(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const regex = /Status code: ([0-9]{3})/;
        const match = error.message.match(regex);
        if (match !== null && match[1] === "404") {
          setDoesChatRoomExist(false);
        }
      }
    }
  };

  useEffect(() => {
    if (doesChatRoomExist && chatId) {
      getMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doesChatRoomExist, chatId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    console.log(`chatId: ${chatId}`);
    if (chatId !== null) {
      subscribeToChatRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const subscribeToChatRoom = () => {
    if (wsClient === null) {
      console.log("not subscribing to chat room");
      return;
    }
    const headers = {
      "Accept-Role":
        store.user.profile?.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    wsClient.subscribe(
      `/user/topic/messages/${chatId}`,
      (message) => {
        const data: WebsocketResponse = JSON.parse(message.body);
        if (data.type === "SEND") {
          if (
            (data.content.senderEmail === store.user.profile?.email &&
              data.content.seenByRecipient ||
            data.content.senderEmail !== store.user.profile?.email
          ) {
            if (data.content.seenByRecipient === true) {
              setLastSeenMessage(data.content.id);
            }
          }
          setMessages((prevMessages) => [...prevMessages, data.content]);
        } else {
          if (data.type === "JOIN") {
            handleJoin(data.joiningUserEmail);
          }
        }
      },
      headers
    );
  };

  const handleJoin = (joiningUserEmail: string | undefined) => {
    if (joiningUserEmail !== store.user.profile?.email) {
      //recipient joined = they read all messages
      if (messagesRef.current.length > 0) {
        setLastSeenMessage(
          messagesRef.current[messagesRef.current.length - 1].id
        );
      }
    } else {
      if (doesChatRoomExist === true && chatId !== null) {
        getMessages();
      }
    }
  };

  const getMessages = async () => {
    const messagesResponse = await api.getMessagesFromSpecifiedChatRoom(
      chatId!,
      "0",
      "10",
      timeZone
    );
    setMessages([...messagesResponse.content].reverse());

    if (messagesResponse.content.length > 0) {
      if (
        messagesResponse.content[0].senderEmail !== store.user.profile?.email
      ) {
        // if last message was sent by recipient we mark it as lastSeenMessage
        setLastSeenMessage(messagesResponse.content[0].id);
      } else {
        setLastSeenMessage(
          messagesResponse.content.find(
            (message) => message.seenByRecipient === true
          )?.id
        );
      }
    }
  };

  //TODO: timezone
  const initializeChatRoom = async (message: string) => {
    console.log("initializing chat room");
    const data = await api.initializeChatRoom(
      recipientEmail,
      message,
      timeZone
    );
    setDoesChatRoomExist(true);
    setChatId(data.chatId);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: 1,
        chatId: data.chatId,
        senderEmail: store.user.profile!.email!,
        content: message,
        createdAt: new Date().toISOString(),
        seenByRecipient: false,
      },
    ]);
  };

  const sendMessageToChatRoom = (message: string) => {
    const headers = {
      "Accept-Role":
        store.user.profile!.selected_profile?.toUpperCase() as string,
      "Accept-Timezone": timeZone,
    };
    if (wsClient && message) {
      const chatMessage = { content: message };
      wsClient.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify(chatMessage),
        headers: headers,
      });
    } else console.log("sending message ended without sending message");
  };

  const disconnectWebSocket = async () => {
    if (wsClientRef.current !== null) {
      wsClientRef.current.deactivate().then(() => {
        console.log("Disconnected");
      });
      setWsClient(null);
    }
  };

  const onSend = (input: string) => {
    if (doesChatRoomExist === false) {
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
    } else if (doesChatRoomExist === true) {
      sendMessageToChatRoom(input);
    }
  };

  return (
    <div className="chat-box-main-container-wrap">
      <div className="chat-box-main-container">
        {doesChatRoomExist !== null && (
          <div className="chat-box-inner-container">
            <ChatTopBar
              onClose={() => onClose()}
              profilePicture={profilePicture}
              name={name}
              surname={surname}
              profile={profile}
              onMinimize={() => {
                onMinimize();
              }}
            />
            <ChatMessages
              messages={messages}
              recipientName={name}
              recipientSurname={surname}
              lastSeenMessageId={lastSeenMessage}
              profilePicture={profilePicture}
            />
            <ChatBottom onSend={onSend} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
