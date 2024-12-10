import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Message from "./Message";
import "../scss/components/_chatMessages.scss";
import { ChatMessage } from "../types/chat.types";
import { useTranslation } from "react-i18next";
import { UserBlockInfo } from "../types";

interface ChatBoxContent {
  messages: ChatMessage[];
  recipientName: string;
  recipientSurname: string;
  lastSeenMessageId?: number;
  profilePicture: string | null;
  blockInfo: UserBlockInfo;
}

const ChatMessages: React.FC<ChatBoxContent> = ({
  messages,
  recipientName,
  recipientSurname,
  lastSeenMessageId,
  profilePicture,
  blockInfo,
}) => {
  const { t } = useTranslation();
  const scrollDownThroughChat = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollDownThroughChat(), [messages, blockInfo.isBlocked]);

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
      {messages.length === 0 && !blockInfo.isBlocked && (
        <div className="chat-messages-no-chat-history">
          {`${t("noChatHistory")} ${recipientName} ${recipientSurname}. ${t(
            "writeFirstMessage"
          )}`}
        </div>
      )}
      {blockInfo.isBlocked && (
        <div className="chat-messages-blocked">
          {`${t("chatIsBlockedBy")} ${blockInfo.whichUserBlocked?.name} ${
            blockInfo.whichUserBlocked?.surname
          }`}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
