import { BorderOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React from "react";
import "../scss/components/_chatMinimized.scss";

interface MinimizedChatProps {
  name: string;
  surname: string;
  profile: string;
  onClose: () => void;
  onMaximize: () => void;
}

const ChatMinimized: React.FC<MinimizedChatProps> = ({
  name,
  surname,
  profile,
  onClose,
  onMaximize,
}) => {
  return (
    <div className="chat-minimized-box-main-container">
      <div className="chat-minimized-options-top-big-container">
        <div className="chat-minimized-options-top-small-container-left">
          <MenuOutlined />
        </div>
        <div className="chat-minimized-options-top-small-container-right">
          <BorderOutlined onClick={() => onMaximize()} />
          <CloseOutlined onClick={() => onClose()} />
        </div>
      </div>

      <div className="chat-minimized-inner-container">
        <h5 className="chat-minimized-inner-container-user-nick">
          {name} {surname}
        </h5>
        <p>{profile}</p>
      </div>
    </div>
  );
};

export default ChatMinimized;
