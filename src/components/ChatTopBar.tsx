import React from "react";
import "../scss/components/_chatTopBar.scss";
import { Avatar } from "antd";
import {
  CloseOutlined,
  MenuOutlined,
  MinusOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface ChatTopBarProps {
  profilePicture: string | null;
  name: string;
  surname: string;
  profile: string;
  onClose: () => void;
  onMinimize: () => void;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({
  profilePicture,
  name,
  surname,
  profile,
  onClose,
  onMinimize,
}) => {
  return (
    <div className="chat-top-bar-container">
      <div className="options-top-big-container">
        <div className="options-top-small-container-left">
          <MenuOutlined />
        </div>
        <div className="options-top-small-container-right">
          <MinusOutlined onClick={() => onMinimize()} />
          <CloseOutlined onClick={() => onClose()} />
        </div>
      </div>
      <div className="comment-container-top">
        <div className="comment-container-user-rating">
          {profilePicture !== null ? (
            <img src={profilePicture} className="profile-image" />
          ) : (
            <Avatar
              size={50}
              className="profile-image"
              icon={<UserOutlined />}
            />
          )}
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

export default ChatTopBar;
