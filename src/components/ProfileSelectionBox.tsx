import React from "react";
import { IconType } from "react-icons";

interface Image {
  icon: IconType;
  size: number;
  title: string;
}

const ProfileSelectionBox: React.FC<Image> = ({ icon: Icon, size, title }) => {
  return (
    <div className="profile-container">
      <div className="profile-box">
        <Icon size={size} />
      </div>
      <h3 className="profile-title">{title}</h3>
    </div>
  );
};

export default ProfileSelectionBox;
