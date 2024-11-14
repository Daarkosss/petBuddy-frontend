import { Badge, Dropdown } from "antd";
import { BellOutlined } from "@ant-design/icons";
import store from "../store/RootStore";
import { observer } from "mobx-react-lite";

const NotificationDropdown = observer(() => {

  const items = store.notification.unread.map((notification) => ({
    key: notification.notificationId,
    label: notification.notificationId,
  }));


  return (
    <Badge count={items.length} overflowCount={10}>
      <Dropdown
        menu={{items}}
        className="notification-dropdown"
        trigger={["click"]}
      >
        <BellOutlined style={{ fontSize: "20px"}}/>
      </Dropdown>
    </Badge>
  );
});

export default NotificationDropdown;
