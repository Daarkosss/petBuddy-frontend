// src/pages/LandingPage.tsx
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { UserProfile } from '../class/userProfile';

const LoginPage: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
      return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
      return (
        <div>
          <div>Not authenticated</div>
          <button onClick={() => keycloak.login()}>Login</button>
        </div>
      );
  }

  if(keycloak.authenticated) {
    console.log('getting user information after login')
    const profile: UserProfile = keycloak.loadUserProfile() as UserProfile
    profile.token = keycloak.token
    console.log('User token: ' + profile.token)
    localStorage.setItem('token', profile.token!!)
  }

  return (
      <div>
          <p>Welcome, {keycloak.tokenParsed?.name}</p>
          <button onClick={() => keycloak.logout()}>Logout</button>
      </div>
  );
};

export default LoginPage;