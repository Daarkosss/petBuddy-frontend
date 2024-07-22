import React from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { Button } from 'react-bootstrap';

const LoginPanel: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-panel">
      <div className="title">To proceed you must be logged in</div>
      <Button size="lg" variant="dark" onClick={() => keycloak.login()}>
        Login or register with Keycloack
      </Button>
    </div>
  );
};

export default LoginPanel;