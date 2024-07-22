import { useKeycloak } from "@react-keycloak/web";
import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { api } from './api/api';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage'
import store from './store/RootStore';

function App() {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const fetchXsrfToken = async () => {
      if (keycloak.authenticated && !store.xsrfToken) {
        await api.getXsrfToken();
      }
    };

    fetchXsrfToken();
  }, [keycloak.authenticated]);

  return (
    <Routes>
      {keycloak.authenticated ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App
