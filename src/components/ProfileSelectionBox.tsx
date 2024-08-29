import React from "react";
import { IconType } from "react-icons";
import store from "../store/RootStore";
import { Profile } from "../store/UserStore";
import { useNavigate } from "react-router-dom";

interface Image {
  icon: IconType;
  size: number;
  title: string;
  profile: Profile;
}

const ProfileSelectionBox: React.FC<Image> = ({
  icon: Icon,
  size,
  title,
  profile,
}) => {
  const navigate = useNavigate();

  return (
    //TODO: add create caretaker profile logic
    <div
      className="profile-container"
      onClick={() => {
        if (profile) {
          store.user.setSelectedProfile(profile);
          navigate("/home");
        }
      }}
    >
      <div className="profile-box">
        <Icon size={size} />
      </div>
      <h3 className="profile-title">{title}</h3>
    </div>
  );
};

export default ProfileSelectionBox;
