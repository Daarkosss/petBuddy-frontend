import { useKeycloak } from "@react-keycloak/web";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api/api";
import Home from "./pages/Home";
import CaretakerForm from "./pages/CaretakerForm";
import LoginPage from "./pages/LoginPage";
import store from "./store/RootStore";
import CaretakerSearch from "./pages/CaretakerSearch";
import ProfileSelection from "./pages/ProfileSelection";
import CaretakerProfile from "./pages/CaretakerProfile";
import ClientProfile from "./pages/ClientProfile";

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [isXsrfTokenFetched, setIsXsrfTokenFetched] = useState(false);
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchXsrfToken = async () => {
      if (keycloak.authenticated && !store.user.xsrfToken) {
        await api.getXsrfToken();
      }
      setIsXsrfTokenFetched(true);
    };

    const fetchUserData = async () => {
      try {
        const userData = await keycloak.loadUserProfile();
        const userProfileData = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          token: store.user.xsrfToken,
          selected_profile: null,
        };
        store.user.saveProfileToStorage(userProfileData);
        setIsUserDataFetched(true);
      } catch (error) {
        console.error(`Failed to load user profile: ${error}`);
      }
    };

    if (initialized) {
      if (keycloak.authenticated) {
        fetchXsrfToken();
        if (store.user.profile === null) {
          fetchUserData();
        } else {
          setIsUserDataFetched(true);
        }
      }
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, keycloak.authenticated]);

  useEffect(() => {
    if (isXsrfTokenFetched && isUserDataFetched) {
      setIsLoading(false);
    }
  }, [isXsrfTokenFetched, isUserDataFetched]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {keycloak.authenticated ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/caretaker/form" element={<CaretakerForm />} />
          <Route path="/caretaker/search" element={<CaretakerSearch />} />
          <Route
            path="/profile-selection"
            element={<ProfileSelection isUserDataFetched={isUserDataFetched} />}
          />
          <Route path="/profile-caretaker" element={<CaretakerProfile />} />
          <Route path="/profile-client" element={<ClientProfile />} />
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

export default App;
