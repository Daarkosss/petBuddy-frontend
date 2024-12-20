import { Avatar, Badge, Input, List, Modal } from "antd";
import {
  LoadingOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";

import { useEffect, useState } from "react";

import "../../scss/components/_chatBadge.scss";
import { Chat } from "../../types/chat.types";
import { api } from "../../api/api";
import store from "../../store/RootStore";
import ChatListTile from "../ChatListTile";
import { useTranslation } from "react-i18next";

const { Search } = Input;

interface ChatBadgeProperties {
  handleOpenChat: (
    recipientEmail: string,
    profilePicture: string | undefined,
    name: string,
    surname: string,
    profile: string
  ) => void;
}

const ChatBadge = observer<ChatBadgeProperties>(({ handleOpenChat }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    size: 5,
    current: 1,
    total: 0,
  });
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 5,
  });

  const gUserChats = async (chatterDataLike?: string) => {
    await api
      .getUserChats(pagingParams, timeZone, chatterDataLike ?? searchValue)
      .then((data) => {
        if (data !== undefined) {
          setUserChats([...data.content]);
          setPagination({
            size: data.pageable.pageSize,
            current: data.pageable.pageNumber + 1,
            total: data.totalElements,
          });
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const getUserChats = async () => {
      await gUserChats();
    };
    getUserChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagingParams,
    store.user.profile?.selected_profile,
    store.notification.unreadChats,
    api.notificationWebSocket.newMessageTrigger,
  ]);

  const handleOnPageChange = (page: number, pageSize?: number) => {
    setPagingParams({
      page: page - 1,
      size: pageSize || 5,
    });
  };

  return (
    <Badge
      count={store.notification.unreadChats}
      overflowCount={10}
      className="notification-badge"
    >
      <MessageOutlined
        style={{ fontSize: "24px" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        title={t("chatRooms")}
      >
        {isLoading === true ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <LoadingOutlined />
          </div>
        ) : (
          <div className="chat-badge-modal-content-container">
            <Search
              placeholder={t("placeholder.inputSearchedText")}
              onSearch={gUserChats}
              enterButton
              loading={isLoading}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => {
                setSearchValue(null);
                gUserChats(undefined);
              }}
              allowClear
            />
            <List
              className="chat-badge-chat-list"
              itemLayout="vertical"
              dataSource={userChats}
              locale={{ emptyText: t("noData") }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.size,
                total: pagination.total,
                onChange: handleOnPageChange,
              }}
              renderItem={(item) => (
                <List.Item
                  className="chat-badge-list-item"
                  extra={
                    <div
                      className="chat-badge-extra"
                      style={{
                        fontWeight:
                          item.lastMessage.seenByRecipient === false &&
                          item.lastMessage.senderEmail !==
                            store.user.profile?.email
                            ? "bold"
                            : "normal",
                      }}
                    >
                      <div>
                        {new Date(
                          item.lastMessage.createdAt
                        ).toLocaleDateString()}
                      </div>
                      <div>
                        {new Date(
                          item.lastMessage.createdAt
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  }
                  style={{ display: "flex", flexDirection: "row" }}
                  onClick={() => {
                    setIsModalOpen(false);
                    handleOpenChat(
                      item.chatter.email,
                      item.chatter.profilePicture?.url || undefined,
                      item.chatter.name,
                      item.chatter.surname,
                      store.user.profile!.selected_profile === "CLIENT"
                        ? "caretaker"
                        : "client"
                    );
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.chatter.profilePicture?.url}
                        icon={
                          item.chatter.profilePicture?.url ? null : (
                            <UserOutlined />
                          )
                        }
                        size={50}
                      />
                    }
                    title={
                      <div className="chat-badge-title">
                        {item.chatter.name} {item.chatter.surname}
                        {!item.lastMessage.seenByRecipient &&
                          item.lastMessage.senderEmail !==
                            store.user.profile?.email && (
                            <div className="chat-badge-not-read"></div>
                          )}
                      </div>
                    }
                    description={item.chatter.email}
                  />
                  <ChatListTile
                    chatterName={item.chatter.name}
                    lastMessageCreatedAt={item.lastMessage.createdAt}
                    lastMessage={item.lastMessage.content}
                    lastMessageSendBy={item.lastMessage.senderEmail}
                    seenByRecipient={item.lastMessage.seenByRecipient}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </Badge>
  );
});

export default ChatBadge;
