import React from "react";
import { Button } from "react-bootstrap";
import keycloak from "../Keycloack";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="sticky-header">
      <h1 className="title" onClick={() => navigate("/")}>Pet Buddy</h1>
      <div className="right-corner">
        <LanguageSwitcher />
        {keycloak.authenticated && 
          <Button className="logout-button" variant="outline-light" onClick={() => keycloak.logout()}>
            {t("logout")}
          </Button>
        }
      </div>
    </div>
  );
}