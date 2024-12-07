import { Badge, Popover, List, Button, Avatar, Space, Tabs } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import store from "../../store/RootStore";
import { Link } from "react-router-dom";
import { Notification } from "../../types/notification.types";
import { useState } from "react";

const NotificationBadge = observer(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("unread");

  const markAllAsRead = async () => {
    try {
      await store.notification.markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const title = (
    <div className="notification-title">
      <div>{t("notification.title")}</div>
      {activeTab === "unread" && (
        <Button
          type="link"
          size="small"
          onClick={markAllAsRead}
          disabled={store.notification.unread.length === 0}
        >
          {t("notification.markAllAsRead")}
        </Button>
      )}
    </div>
  );

  const notificationList = (notifications: Notification[]) => {
    if (notifications.length === 0) {
      return (
        <div className="no-notifications">
          {t("notification.noNotifications")}
        </div>
      );
    }

    return (
      <>
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item>
              <Space align="start">
                <Avatar
                  style={{ marginTop: "5px" }}
                  size={40}
                  icon={!notification.triggeredBy.profilePicture && <UserOutlined />}
                  src={notification.triggeredBy.profilePicture && notification.triggeredBy.profilePicture.url} 
                />
                <div className="list-item">
                  <Link
                    to={`/care/${notification.objectId}`}
                    style={{ textDecoration: "none" }}
                  >
                    {t(
                        `notification.${notification.messageKey}`,
                        { user: ` ${notification.triggeredBy.name} ${notification.triggeredBy.surname}` }
                    )}
                  </Link>
                  <div className="date-time">
                    {new Date(notification.createdAt).toLocaleString(
                      [],
                      { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
                    )}
                  </div>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </>
    );
  };

  const content = (
    <div className="notification-content">
      <Tabs
        defaultActiveKey="unread"
        onChange={(key) => setActiveTab(key)}
        size="small"
        centered
        items={[
          {
            key: "unread",
            label: t("notification.unread"),
            children: notificationList(store.notification.unread),
          },
          {
            key: "read",
            label: t("notification.read"),
            children: notificationList(store.notification.read),
          },
        ]}
      />
    </div>
  );

  return (
    <Popover content={content} title={title} trigger="click">
      <Badge
        count={store.notification.unread.length}
        overflowCount={10}
        className="notification-badge"
      >
        <BellOutlined style={{ fontSize: "24px" }} />
      </Badge>
    </Popover>
  );
});

export default NotificationBadge;
