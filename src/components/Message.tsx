import React, { useState } from "react";
import store from "../store/RootStore";
import "../scss/components/_message.scss";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface MessageContent {
  message: string;
  recipientName: string;
  recipientSurname: string;
  senderEmail: string;
  timeSent: string;
  showAvatar: boolean;
  profilePicture: string | null;
}

const Message: React.FC<MessageContent> = ({
  message,
  recipientName,
  recipientSurname,
  senderEmail,
  timeSent,
  showAvatar,
  profilePicture,
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
            className="message-avatar"
            src={profilePicture}
            icon={profilePicture ? null : <UserOutlined />}
            size={16}
            style={{
              visibility: showAvatar ? "visible" : "hidden",
            }}
          />
        </div>
      </div>

      <div
        className="message-send-time"
        style={{ display: showDate ? "inline" : "none" }}
      >
        {`${new Date(timeSent).toLocaleDateString()} ${new Date(
          timeSent
        ).toLocaleTimeString()}`}
      </div>
    </div>
  );
};

export default Message;
