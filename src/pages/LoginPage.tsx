// src/pages/LandingPage.tsx
import React, { useEffect } from 'react';
import LoginPanel from '../components/LoginPanel';
import { Header } from '../components/Header';
import store from '../store/RootStore';

const LoginPage: React.FC = () => {

  useEffect(() => {
    store.reset();
  }, []);

  return (
    <div>
      <Header />
      <div className="login-container">
        <LoginPanel />
      </div>
    </div>
  );
};

export default LoginPage;