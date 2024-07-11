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
      <div>Login with keycloak</div>
      <Button variant="dark" onClick={() => keycloak.login()}>Login</Button>
    </div>
  );
};

export default LoginPanel;