import { Badge, Popover, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { Link } from "react-router-dom";

const NotificationBadge = observer(() => {
  const { t } = useTranslation();

  const markAllAsRead = async () => {
    try {
      await store.notification.markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const title = (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
      <div>{t("notification.title")}</div>
      <Button
        type="link"
        size="small"
        onClick={markAllAsRead}
        disabled={store.notification.unread.length === 0}
      >
        {t("notification.markAllAsRead")}
      </Button>
    </div>
  )

  const content = (
    <div style={{ maxHeight: "300px", overflowY: "auto", width: "300px" }}>
      {store.notification.unread.length > 0 ? (
        <>
          <List
            dataSource={store.notification.unread}
            renderItem={(notification) => (
              <List.Item>
                <div style={{ marginLeft: "10px", width: "100%" }}>
                  <Link
                    to={`/care/${notification.objectId}`}
                    style={{ textDecoration: "none" }}
                  >
                    {t(`notification.${notification.messageKey}`)}
                  </Link>
                  <div style={{ fontSize: "11px", color: "gray" }}>
                    {new Date(notification.createdAt).toLocaleString(
                      [],
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", color: "gray" }}>
          {t("notification.noNotifications")}
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content} title={title} trigger="click">
      <Badge
        count={store.notification.unread.length}
        overflowCount={10}
        className="notification-badge"
      >
        <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
});

export default NotificationBadge;
