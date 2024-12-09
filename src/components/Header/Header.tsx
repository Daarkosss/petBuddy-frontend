import { useKeycloak } from "@react-keycloak/web";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Drawer } from "antd";
import { Header } from "antd/es/layout/layout";
import { MenuOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import NotificationBadge from "./NotificationBadge";
import ChatBadge from "./ChatBadge";
import store from "../../store/RootStore";
import BlockedUsersBadge from "./BlockedUsersBadge";

interface PageHeaderProperties {
  handleOpenChat: (
    recipientEmail: string,
    profilePicture: string | undefined,
    name: string,
    surname: string,
    profile: string
  ) => void;
  handleBlockUnblockUser: (
    userEmail: string,
    option: string,
    onSuccess?: () => void
  ) => void;
  triggerReload: boolean;
}

const PageHeader = observer<PageHeaderProperties>(
  ({ handleOpenChat, handleBlockUnblockUser, triggerReload }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { keycloak } = useKeycloak();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const authenticatedMenuItems = [
      {
        key: "profile",
        label: t("profile"),
        onClick: () =>
          navigate("/profile-client", {
            state: { userEmail: store.user.profile?.email },
          }),
      },
      {
        key: "cares",
        label: t("care.yourCares"),
        onClick: () => navigate("/cares"),
      },
    ];

    const menuItems = [
      {
        key: "home",
        label: t("home"),
        onClick: () => navigate("/"),
      },
      {
        key: "caretakerSearch",
        label: t("searchCaretakers"),
        onClick: () => navigate("/caretaker/search"),
      },
      ...(keycloak.authenticated ? authenticatedMenuItems : []),
      {
        key: "termsAndConditions",
        label: t("termsAndConditions"),
        onClick: () => navigate("/terms-and-conditions"),
      },
    ];

    const menu = (
      <Menu
        items={menuItems.map((item) => ({
          ...item,
          onClick: () => {
            item.onClick && item.onClick();
            setDrawerVisible(false);
          },
        }))}
        selectedKeys={[store.selectedMenuOption]}
      />
    );

    return (
      <Header className="header">
        <div className="menu-mobile">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
          />
          <Drawer
            title={t("menu")}
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            {menu}
          </Drawer>
        </div>

        <div className="logo" onClick={() => navigate("/")}>
          <img src="/images/pet-buddy-logo.svg" alt="Logo" />
        </div>

        <div className="menu-desktop">
          <Menu
            mode="horizontal"
            disabledOverflow
            selectedKeys={[store.selectedMenuOption]}
            items={menuItems}
          />
        </div>

        <div className="right-corner">
          {keycloak.authenticated && (
            <>
              {store.user.profile?.selected_profile !== null && (
                <BlockedUsersBadge
                  handleBlockUnblockUser={handleBlockUnblockUser}
                  triggerReload={triggerReload}
                />
              )}
              {store.user.profile?.selected_profile !== null && (
                <ChatBadge handleOpenChat={handleOpenChat} />
              )}
              <NotificationBadge />
            </>
          )}
          <LanguageSwitcher />
          {keycloak.authenticated ? (
            <Button
              type="primary"
              className="auth-button"
              onClick={() => keycloak.logout()}
            >
              {t("logout")}
            </Button>
          ) : (
            <Button
              type="primary"
              className="auth-button"
              onClick={() => keycloak.login()}
            >
              {t("loginOrRegister")}
            </Button>
          )}
        </div>
      </Header>
    );
  }
);

export default PageHeader;
