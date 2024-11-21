import React, { useState } from "react";
import store from "../store/RootStore";
import "../scss/components/_message.scss";
import { Avatar } from "antd";

interface MessageContent {
  message: string;
  recipientName: string;
  recipientSurname: string;
  senderEmail: string;
  timeSent: string;
  showAvatar: boolean;
}

const Message: React.FC<MessageContent> = ({
  message,
  recipientName,
  recipientSurname,
  senderEmail,
  timeSent,
  showAvatar,
}) => {
  const [showDate, setShowDate] = useState<boolean>(false);
  return (
    <div
      className={
        store.user.profile?.email === senderEmail
          ? "message-author"
          : "message-recipient"
      }
      onClick={() => setShowDate(!showDate)}
    >
      <div className="message-cloud-avatar">
        <div className="message-content-name">
          <div className="message-content">{message}</div>
          <div className="message-sender">
            {store.user.profile?.email === senderEmail
              ? `${store.user.profile?.firstName} ${store.user.profile?.lastName}`
              : `${recipientName} ${recipientSurname}`}
          </div>
        </div>
        <div className="message-avatar-container">
          <Avatar
            size={15}
            style={{
              visibility: showAvatar === true ? "visible" : "hidden",
            }}
          />
        </div>
      </div>

      <div
        className="message-send-time"
        style={{ display: showDate === true ? "inline" : "none" }}
      >
        {`${new Date(timeSent).toLocaleDateString()} ${new Date(
          timeSent
        ).toLocaleTimeString()}`}
      </div>
    </div>
  );
};

export default Message;
