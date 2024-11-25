import { Badge, List, Modal } from "antd";
import { LoadingOutlined, MessageOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";

import { useEffect, useState } from "react";

import "../../scss/components/_chatBadge.scss";
import { Chat } from "../../types/chat.types";
import { api } from "../../api/api";
import store from "../../store/RootStore";
import ChatListTile from "../ChatListTile";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    size: 5,
    current: 1,
    total: 0,
  });

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 5,
  });

  useEffect(() => {
    const getUserChats = async () => {
      await api.getUserChats(pagingParams, null).then((data) => {
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
    getUserChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagingParams,
    store.user.profile?.selected_profile,
    store.notification.unreadChats,
    api.notificationWebSocket.receiveNewMessageTrigger,
  ]);

  const handleOnPageChange = (page: number, pageSize?: number) => {
    console.log(page);
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
      >
        {isLoading === true ? (
          <LoadingOutlined />
        ) : (
          <List
            className="chat-badge-chat-list"
            itemLayout="vertical"
            dataSource={userChats}
            pagination={{
              current: pagination.current,
              pageSize: pagination.size,
              total: pagination.total,
              onChange: handleOnPageChange,
            }}
            renderItem={(item) => (
              <List.Item
                extra={
                  <div
                    className="chat-badge-extra"
                    style={{
                      fontWeight:
                        item.seenByPrincipal === false ? "bold" : "normal",
                    }}
                  >
                    <div>
                      {new Date(item.lastMessageCreatedAt).toLocaleDateString()}
                    </div>
                    <div>
                      {new Date(item.lastMessageCreatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                }
                style={{ display: "flex", flexDirection: "row" }}
                onClick={() => {
                  setIsModalOpen(false);
                  handleOpenChat(
                    item.chatterEmail,
                    undefined,
                    item.chatterName,
                    item.chatterSurname,
                    store.user.profile!.selected_profile === "CLIENT"
                      ? "caretaker"
                      : "client"
                  );
                }}
              >
                <List.Item.Meta
                  title={
                    <div className="chat-badge-title">
                      {item.chatterName} {item.chatterSurname}
                      {item.seenByPrincipal === false && (
                        <div className="chat-badge-not-read"></div>
                      )}
                    </div>
                  }
                  description={item.chatterEmail}
                />
                <ChatListTile
                  chatterName={item.chatterName}
                  lastMessageCreatedAt={item.lastMessageCreatedAt}
                  lastMessage={item.lastMessage}
                  lastMessageSendBy={item.lastMessageSendBy}
                  seenByPrincipal={item.seenByPrincipal}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </Badge>
  );
});

export default ChatBadge;
