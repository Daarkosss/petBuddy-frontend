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
    <div className="chat-minimized-box-main-container-wrap">
      <div className="chat-minimized-box-main-container">
        <div className="chat-minimized-box-inner-container">
          <div className="chat-top-bar-container">
            <div className="options-top-big-container">
              <div className="options-top-small-container-left">
                <MenuOutlined />
              </div>
              <div className="options-top-small-container-right">
                <BorderOutlined onClick={() => onMaximize()} />
                <CloseOutlined onClick={() => onClose()} />
              </div>
            </div>
            <div className="comment-container-top">
              <div className="comment-container-user-rating">
                <div className="comment-container-user-nick-container">
                  <h5 className="comment-container-user-nick">
                    {name} {surname}
                  </h5>
                  <p>{profile}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMinimized;
