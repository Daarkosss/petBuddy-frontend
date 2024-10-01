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
  onHover: () => void;
  onLeave: () => void;
}

const ProfileSelectionBox: React.FC<Image> = ({
  icon: Icon,
  size,
  title,
  profile,
  onHover,
  onLeave,
}) => {
  const navigate = useNavigate();

  return (
    //TODO: add create caretaker profile logic
    <div
      className="profile-container"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => {
        if (profile) {
          store.user.setSelectedProfile(profile);
          store.user.saveProfileToStorage(store.user.profile);
          navigate("/home");
        } else {
          navigate("/caretaker/form");
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
