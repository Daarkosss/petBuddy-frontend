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
}

const ChatMessages: React.FC<ChatBoxContent> = ({
  messages,
  recipientName,
  recipientSurname,
  lastSeenMessageId,
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
        <div key={i}>
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
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
