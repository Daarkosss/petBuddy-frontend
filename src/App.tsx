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

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  // const [xsrfToken, setXsrfToken] = useState();

  useEffect(() => {
    const fetchXsrfToken = async () => {
      if (keycloak.authenticated && !store.user.xsrfToken) {
        await api.getXsrfToken();
        try {
          const userData = await keycloak.loadUserProfile();
          const userProfileData = {
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            token: store.user.xsrfToken,
            selected_profile: null,
          };
          store.user.saveProfileToStorage(userProfileData);
        } catch (error) {
          console.error(`Failed to load user profile: ${error}`);
        }
        // setXsrfToken(fetchedXsrfToken)
      }
      setIsLoading(false);
    };

    if (initialized) {
      if (keycloak.authenticated) {
        fetchXsrfToken();
      } else {
        setIsLoading(false);
      }
    }
  }, [initialized, keycloak.authenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {keycloak.authenticated ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route
            path="/caretaker/form"
            element={<CaretakerForm onSubmit={() => {}} />}
          />
          <Route path="/caretaker/search" element={<CaretakerSearch />} />
          <Route path="/profile-selection" element={<ProfileSelection />} />
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
