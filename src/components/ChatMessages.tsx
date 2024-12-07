import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Message from "./Message";
import "../scss/components/_chatMessages.scss";
import { ChatMessage } from "../types/chat.types";

interface ChatBoxContent {
  messages: ChatMessage[];
  recipientName: string;
  recipientSurname: string;
  lastSeenMessageId?: number;
  profilePicture: string | null;
}

const ChatMessages: React.FC<ChatBoxContent> = ({
  messages,
  recipientName,
  recipientSurname,
  lastSeenMessageId,
  profilePicture,
}) => {
  const scrollDownThroughChat = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollDownThroughChat(), [messages]);

  return (
    <div className="chat-messages-container">
      {messages.map((message, i) => (
        <div key={i} className="chat-messages-inner-container">
          <Message
            message={message.content}
            recipientName={recipientName}
            recipientSurname={recipientSurname}
            senderEmail={message.senderEmail}
            timeSent={message.createdAt}
            showAvatar={
              lastSeenMessageId !== undefined
                ? message.id === lastSeenMessageId
                : false
            }
            profilePicture={profilePicture}
          />
        </div>
      ))}
      {messages.length === 0 && (
        <div className="chat-messages-no-chat-history">
          Brak historii chatu z{" "}
          {`${recipientName} ${recipientSurname}. Napisz pierwszą wiadomość`}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
