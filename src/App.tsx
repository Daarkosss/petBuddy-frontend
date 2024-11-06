import { useKeycloak } from "@react-keycloak/web";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { api } from "./api/api";
import CaretakerForm from "./pages/CaretakerForm";
import store from "./store/RootStore";
import CaretakerSearch from "./pages/CaretakerSearch";
import ProfileSelection from "./pages/ProfileSelection";
import OfferManagement from "./pages/OfferManagement";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import { observer } from "mobx-react-lite";
import CareReservationForm from "./pages/CareReservationForm";
import CaretakerProfile from "./pages/CaretakerProfile";
import ClientProfile from "./pages/ClientProfile";
import CaresList from "./pages/Cares";

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
          selected_profile: store.user.profile?.selected_profile || null,
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
        fetchUserData();
        setIsUserDataFetched(true);
      } else {
        store.user.reset();
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

  if (!store.isStarting) {
    return (
      <Layout>
        <Header />
        <Content className="page-content">
          <Routes>
            {keycloak.authenticated ? (
              store.user.profile?.selected_profile ? (
                <>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/caretaker/form" element={<CaretakerForm />} />
                  <Route
                    path="/caretaker/search"
                    element={<CaretakerSearch />}
                  />
                  <Route
                    path="/caretaker/offers"
                    element={<OfferManagement />}
                  />
                  <Route
                    path="/care/reservation/:caretakerEmail" 
                    element={<CareReservationForm />}
                  />
                  <Route
                    path="/cares"
                    element={
                      <CaresList />
                    }
                  />
                  <Route
                    path="/profile-selection"
                    element={
                      <ProfileSelection isUserDataFetched={isUserDataFetched} />
                    }
                  />
                  <Route
                    path="/profile-caretaker/:caretakerEmail"
                    element={<CaretakerProfile />}
                  />
                  <Route path="/profile-client" element={<ClientProfile />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  <Route
                    path="/profile-selection"
                    element={
                      <ProfileSelection isUserDataFetched={isUserDataFetched} />
                    }
                  />
                  <Route path="/caretaker/form" element={<CaretakerForm />} />
                  <Route
                    path="*"
                    element={<Navigate to="/profile-selection" replace />}
                  />
                </>
              )
            ) : (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/profile-caretaker/:caretakerEmail"
                  element={<CaretakerProfile />}
                />
                <Route path="/caretaker/search" element={<CaretakerSearch />} />
                <Route path="*" element={<Navigate to ="/" replace />} />
              </>
            )}
          </Routes>
        </Content>
      </Layout>
    );
  }
});

export default App;
