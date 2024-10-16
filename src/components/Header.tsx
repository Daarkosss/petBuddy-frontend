import { useKeycloak } from "@react-keycloak/web";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Drawer } from "antd";
import { Header } from "antd/es/layout/layout";
import { MenuOutlined } from "@ant-design/icons";
import store from "../store/RootStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const PageHeader = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: "home",
      label: t("home"),
      onClick: () => navigate("/")
    },
    {
      key: "caretakerSearch",
      label: t("searchCaretakers"),
      onClick: () => navigate("/caretaker/search")
    },
    {
      key: "aboutUs",
      label: t("aboutUs"),
    }
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
        <img src="/favicon.png" alt="Logo" />
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
});

export default PageHeader;
