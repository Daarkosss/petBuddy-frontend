import { Badge, Popover, List } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { Link } from "react-router-dom";

const NotificationBadge = observer(() => {
  const { t } = useTranslation();

  const content = (
    <div style={{ maxHeight: "300px", overflowY: "auto", width: "300px" }}>
      {store.notification.unread.length > 0 ? (
        <List
          dataSource={store.notification.unread}
          renderItem={(notification) => (
            <List.Item>
              <div style={{ marginLeft: "10px", width: "100%" }}>
                <Link
                  to={`/care/${notification.objectId}`}
                  style={{ textDecoration: "none"}}
                >
                  {t(notification.messageKey)}
                </Link>
                <div style={{ fontSize: "11px", color: "gray" }}>
                  {new Date(notification.createdAt).toLocaleString(
                    [], 
                    {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"}
                  )}
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
    >
      <Badge count={store.notification.unread.length} overflowCount={10} className="notification-badge">
        <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
});

export default NotificationBadge;
