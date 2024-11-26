import React from "react";
import store from "../store/RootStore";
import "../scss/components/_chatListTile.scss";
import { useTranslation } from "react-i18next";

interface ChatListTileProperties {
  chatterName: string;
  lastMessageCreatedAt: string;
  lastMessage: string;
  lastMessageSendBy: string;
  seenByRecipient: boolean;
}

const ChatListTile: React.FC<ChatListTileProperties> = ({
  chatterName,
  lastMessage,
  lastMessageSendBy,
  seenByRecipient,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className="chat-list-tile-container"
      style={{
        fontWeight:
          seenByRecipient === false &&
          lastMessageSendBy !== store.user.profile?.email
            ? "bold"
            : "normal",
      }}
    >
      {lastMessageSendBy === store.user.profile?.email
        ? `${t("you")}:`
        : `${chatterName}: `}{" "}
      {lastMessage.length > 9
        ? `${lastMessage.substring(0, 9)}... `
        : `${lastMessage} `}
    </div>
  );
};

export default ChatListTile;
