// src/pages/LandingPage.tsx
import React from 'react';
import LoginPanel from '../components/LoginPanel';
import { Header } from '../components/Header';

const LoginPage: React.FC = () => {
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