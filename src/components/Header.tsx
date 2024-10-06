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
      label: "Home",
      onClick: () => navigate("/")
    },
    {
      key: "caretakerSearch",
      label: "Search Caretakers",
      onClick: () => navigate("/caretaker/search")
    },
    {
      key: "aboutUs",
      label: "About Us"
    }
  ]

  return (
    <Header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/favicon.png" alt="Logo" />
      </div>
      <Menu mode="horizontal" selectedKeys={[store.selectedMenuOption]} items={menuItems}>

      </Menu>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <LanguageSwitcher/>
        {keycloak.authenticated 
          ? <Button className="logout-button" onClick={() => keycloak.logout()}>
            {t("logout")}
          </Button>
          : <Button type="primary" className="login-button" onClick={() => keycloak.login()}>
            Login or Register
          </Button>
        }
      </div>
    </Header>
  );
})

export default PageHeader;