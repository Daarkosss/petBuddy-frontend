import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Message from "./Message";
import "../scss/components/_chatMessages.scss";

interface ChatBoxContent {
  messages: {
    id: number;
    chatId: number;
    senderEmail: string;
    content: string;
    createdAt: string;
    seenByRecipient: boolean;
  }[];
}

const ChatMessages: React.FC<ChatBoxContent> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-messages-container">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message.content} name={message.senderEmail} />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
