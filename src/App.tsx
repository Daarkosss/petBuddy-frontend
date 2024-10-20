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
import { observer } from "mobx-react-lite";

const { Content } = Layout;

const App = observer(() => {
  const { keycloak, initialized } = useKeycloak();
  const [isXsrfTokenFetched, setIsXsrfTokenFetched] = useState(false);
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);

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
        const userProfiles = await api.getUserProfiles();
        const userProfileData = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          token: store.user.xsrfToken,
          selected_profile: null,
          hasCaretakerProfile: userProfiles.hasCaretakerProfile,
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
      store.isStarting = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, keycloak.authenticated]);

  useEffect(() => {
    if (isXsrfTokenFetched && isUserDataFetched) {
      store.isStarting = false;
    }
  }, [isXsrfTokenFetched, isUserDataFetched]);

  return (
    <Layout>
      <Header/>
      <Content className="page-content">
        <Routes>
          {keycloak.authenticated ? (
            store.user.profile?.selected_profile ? (
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
              <Route
                path="/*"
                element={<ProfileSelection isUserDataFetched={isUserDataFetched} />}
              />
            )
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
});

export default App;
