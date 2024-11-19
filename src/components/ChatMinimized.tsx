import { BorderOutlined } from "@ant-design/icons";
import React from "react";
import "../scss/components/_chatTopBar.scss";

interface MinimizedChatProps {
  name: string;
  surname: string;
  profile: string;
}

const ChatMinimized: React.FC<MinimizedChatProps> = ({
  name,
  surname,
  profile,
}) => {
  return (
    <div className="chat-top-bar-container">
      <div className="options-top-big-container">
        <div className="options-top-small-container">
          <BorderOutlined />
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
  );
};

export default ChatMinimized;
