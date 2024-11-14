import { Badge, Popover, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";

const NotificationBadge = observer(() => {
  const { t } = useTranslation();

  const handleNotificationClick = (notificationId: number) => {
    console.log("Navigating to notification:", notificationId);
    // store.notification.markAsRead(notificationId);
  };

  const content = (
    <div style={{ maxHeight: "300px", overflowY: "auto", width: "300px" }}>
      {store.notification.unread.length > 0 ? (
        <List
          dataSource={store.notification.unread}
          renderItem={(notification) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <Button
                  type="link"
                  onClick={() => handleNotificationClick(notification.notificationId)}
                  style={{ padding: 0, textAlign: "left", width: "100%" }}
                >
                  {t(notification.messageKey)}
                </Button>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: "center", color: "gray" }}>
          {t("No notifications")}
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      title={t("Notifications")}
      trigger="click"
      placement="bottomRight"
    >
      <Badge count={store.notification.unread.length} overflowCount={10} className="notification-badge">
        <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
});

export default NotificationBadge;
