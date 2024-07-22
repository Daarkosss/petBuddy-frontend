import { useKeycloak } from "@react-keycloak/web";
import { Route, Routes, Navigate, } from 'react-router-dom';
import { useEffect, useState } from "react";
import { api } from './api/api';
import Home from './pages/Home';
import CaretakerForm from './pages/CaretakerForm';
import LoginPage from './pages/LoginPage'
import store from './store/RootStore';

function App() {
  const { keycloak } = useKeycloak();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXsrfToken = async () => {
      if (keycloak.authenticated && !store.xsrfToken) {
        await api.getXsrfToken();
      }
      setLoading(false);
    };

    keycloak.onReady = () => {
      fetchXsrfToken();
    };
  }, [keycloak, keycloak.authenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {keycloak.authenticated ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route 
            path="/caretaker/form"
            element={<CaretakerForm onSubmit={() => {}}/>} 
          />
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
