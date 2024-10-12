import React from "react";
import store from "../store/RootStore";
import "../scss/components/_message.scss";

interface MessageContent {
  message: string;
  name: string;
}

const Message: React.FC<MessageContent> = ({ message, name }) => {
  return (
    <div
      className={
        store.user.profile!.email === name
          ? "message-author"
          : "message-recipient"
      }
    >
      <div>
        <div>{message}</div>
        <div>{name}</div>
      </div>
    </div>
  );
};

export default Message;
