import React from 'react';
import { Button } from 'react-bootstrap';
import keycloak from "../Keycloack";

export const Header: React.FC = () => {
  return (
    <div className="sticky-header">
      <h1 className="title">Pet Buddy</h1>
      {keycloak.authenticated && 
        <Button className="logout-button" variant="dark" onClick={() => keycloak.logout()}>
          Logout
        </Button>
      }
    </div>
  );
}