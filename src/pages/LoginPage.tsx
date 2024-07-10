// src/pages/LandingPage.tsx
import React from 'react';
import LoginPanel from '../components/LoginPanel';

const LoginPage: React.FC = () => {
  return (
    <div>
      <div className="sticky-header">
        <h1 className='title'>
            Pet Buddy
        </h1>
      </div>
      <div className="login-container">
        <LoginPanel />
      </div>
    </div>
  );
};

export default LoginPage;
