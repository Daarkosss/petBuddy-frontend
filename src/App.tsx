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
import Header from "./components/Header/Header";
import { observer } from "mobx-react-lite";
import CareReservationForm from "./pages/CareReservationForm";
import CaretakerProfile from "./pages/CaretakerProfile";
import ClientProfile from "./pages/ClientProfile";
import CareList from "./pages/CareList";
import CareDetails from "./pages/CareDetails";
import TermsAndConditions from "./pages/TermsAndConditions";

const { Content } = Layout;

const App = observer(() => {
  const { keycloak, initialized } = useKeycloak();
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (keycloak.authenticated) {
          if (!store.user.xsrfToken) {
            await api.getXsrfToken()
          }

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
  
          try {
            await store.notification.setup();
          } catch (error) {
            console.error(`Failed to setup notifications: ${error}`);
          }
        } else {
          store.user.reset();
        }
      } finally {
        store.isStarting = false;
      }
    };
  
    if (initialized) {
      initializeApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, keycloak.authenticated]);

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
                      <CareList />
                    }
                  />
                  <Route
                    path="/care/:careId"
                    element={
                      <CareDetails />
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
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
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
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
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
