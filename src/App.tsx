import { useKeycloak } from "@react-keycloak/web";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage'
import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const { keycloak } = useKeycloak();

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
