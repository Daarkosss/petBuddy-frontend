import { Badge } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import store from "../../store/RootStore";

const ChatBadge = observer(() => {
  return (
    <Badge
      count={store.notification.unreadChats}
      overflowCount={10}
      className="notification-badge"
    >
      <MessageOutlined 
        style={{ fontSize: "24px" }}
        // onClick={() => navigate("/chat")} // To do when chats will be ready
      />
    </Badge>
  );
});

export default ChatBadge;
