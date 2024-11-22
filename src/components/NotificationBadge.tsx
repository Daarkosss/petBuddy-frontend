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
    <div className="notification-title">
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
    <div className="notification-content">
      {store.notification.unread.length > 0 ? (
        <>
          <List
            dataSource={store.notification.unread}
            renderItem={(notification) => (
              <List.Item>
                <div className="list-item">
                  <Link
                    to={`/care/${notification.objectId}`}
                    style={{ textDecoration: "none" }}
                  >
                    {t(`notification.${notification.messageKey}`)}
                  </Link>
                  <div className="date-time">
                    {new Date(notification.createdAt).toLocaleString(
                      [],
                      { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <div className="no-notifications">
          {t("notification.noNotifications")}
        </div>
      )}
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
