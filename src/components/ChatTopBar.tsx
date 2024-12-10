import React, { useState } from "react";
import "../scss/components/_chatTopBar.scss";
import { Avatar, Dropdown, Popconfirm } from "antd";
import {
  CloseOutlined,
  MenuOutlined,
  MinusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { UserBlockInfo } from "../types";

interface ChatTopBarProps {
  profilePicture: string | null;
  name: string;
  surname: string;
  profile: string;
  onClose: () => void;
  onMinimize: () => void;
  blockInfo: UserBlockInfo;
  recipientEmail: string;
  setBlockInfo: (
    isBlocked: boolean,
    name: string,
    surname: string,
    email: string
  ) => void;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({
  profilePicture,
  name,
  surname,
  profile,
  onClose,
  onMinimize,
  blockInfo,
  recipientEmail,
  setBlockInfo,
}) => {
  const { t } = useTranslation();
  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] =
    useState<boolean>(false);

  const handleBlockUser = () => {
    setShowDeleteConfirmationPopup(false);
    if (!blockInfo.isBlocked) {
      store.blocked.blockUser(recipientEmail).then(() => {
        setBlockInfo(
          true,
          store.user.profile!.firstName!,
          store.user.profile!.lastName!,
          store.user.profile!.email!
        );
      });
    } else {
      store.blocked.unblockUser(recipientEmail).then(() => {
        setBlockInfo(false, "", "", "");
      });
    }
  };

  const items = [
    {
      key: "blockuser",
      label: blockInfo.isBlocked
        ? blockInfo.whichUserBlocked?.email !== store.user.profile?.email
          ? t("youHaveBeenBlocked")
          : t("unblockUser")
        : t("blockUser"),
      onClick: () => setShowDeleteConfirmationPopup(true),
      danger: true,
      disabled:
        blockInfo.isBlocked &&
        blockInfo.whichUserBlocked?.email !== store.user.profile?.email,
    },
  ];

  return (
    <div className="chat-top-bar-container">
      <div className="options-top-big-container">
        <div className="options-top-small-container-left">
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            className="options-top-menu"
          >
            <div>
              <MenuOutlined />
            </div>
          </Dropdown>
          <Popconfirm
            open={showDeleteConfirmationPopup}
            className="options-top-menu-confirm-block-user"
            title={blockInfo.isBlocked ? t("sureToUnblock") : t("sureToBlock")}
            description={!blockInfo.isBlocked ? t("blockInfo") : null}
            onConfirm={() => {
              handleBlockUser();
            }}
            onCancel={() => setShowDeleteConfirmationPopup(false)}
            okText={t("yes")}
            cancelText={t("no")}
          />
        </div>
        <div className="options-top-small-container-right">
          <div className="options-top-small-container-minimize">
            <MinusOutlined onClick={() => onMinimize()} />
          </div>
          <div className="options-top-small-container-close">
            <CloseOutlined onClick={() => onClose()} />
          </div>
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
