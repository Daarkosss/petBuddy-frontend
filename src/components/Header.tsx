import { useKeycloak } from "@react-keycloak/web";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Menu, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import store from "../store/RootStore";
import { observer } from "mobx-react-lite";

const PageHeader = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

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
  ]

  return (
    <Header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/favicon.png" alt="Logo" />
      </div>
      <Menu
        mode="horizontal"
        disabledOverflow
        selectedKeys={[store.selectedMenuOption]} 
        items={menuItems}
      >

      </Menu>
      <div className="right-corner">
        <LanguageSwitcher/>
        {keycloak.authenticated 
          ? <Button type="primary" className="auth-button" onClick={() => keycloak.logout()}>
            {t("logout")}
          </Button>
          : <Button type="primary" className="auth-button" onClick={() => keycloak.login()}>
            {t("loginOrRegister")}
          </Button>
        }
      </div>
    </Header>
  );
})

export default PageHeader;