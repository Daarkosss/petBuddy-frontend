import { useKeycloak } from "@react-keycloak/web";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api/api";
import CaretakerForm from "./pages/CaretakerForm";
import store from "./store/RootStore";
import CaretakerSearch from "./pages/CaretakerSearch";
import ProfileSelection from "./pages/ProfileSelection";
import LandingPage from "./pages/LandingPage";
import { Layout } from "antd";
import Header from "./components/Header";

const { Content } = Layout;

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
    <Layout>
      <Header/>
      <Content className="page-content">
        <Routes>
          {keycloak.authenticated ? (
            <>
              <Route path="/caretaker/form" element={<CaretakerForm />} />
              <Route path="/caretaker/search" element={<CaretakerSearch />} />
              <Route
                path="/profile-selection"
                element={<ProfileSelection isUserDataFetched={isUserDataFetched} />}
              />
              <Route path="*" element={<LandingPage />} />
              </>
          ) : (
            <>
              <Route path="/caretaker/search" element={<CaretakerSearch />} />
              <Route path="*" element={<LandingPage />} />
            </>
          )}
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
