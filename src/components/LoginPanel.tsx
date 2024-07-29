import React from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LoginPanel: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-panel">
      <div className="title">{t('loginPage.proceedInfo')}</div>
      <Button size="lg" variant="light" onClick={() => keycloak.login()}>
        {t('loginPage.loginOrRegister')}
      </Button>
    </div>
  );
};

export default LoginPanel;