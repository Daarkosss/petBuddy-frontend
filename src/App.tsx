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
import CareList from "./pages/CareList";
import CareDetails from "./pages/CareDetails";
import ChatBox from "./components/ChatBox";
import ChatMinimized from "./components/ChatMinimized";
import { useTranslation } from "react-i18next";

const { Content } = Layout;

interface OpenChatAttributes {
  shouldOpenMaximizedChat: boolean;
  shouldOpenMinimizedChat: boolean;
  recipientEmail: string | undefined;
  profilePicture: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  profile: string | undefined;
}

const App = observer(() => {
  const { t } = useTranslation();
  const { keycloak, initialized } = useKeycloak();
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);
  const [openChat, setOpenChat] = useState<OpenChatAttributes>({
    shouldOpenMaximizedChat: false,
    shouldOpenMinimizedChat: false,
    recipientEmail: undefined,
    profilePicture: undefined,
    name: undefined,
    surname: undefined,
    profile: undefined,
  });

  const handleOpenChat = (
    recipientEmail: string,
    profilePicture: string | undefined,
    name: string,
    surname: string,
    profile: string
  ) => {
    setOpenChat({
      shouldOpenMaximizedChat: true,
      shouldOpenMinimizedChat: false,
      recipientEmail: recipientEmail,
      profilePicture: profilePicture,
      name: name,
      surname: surname,
      profile: profile,
    });
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (keycloak.authenticated) {
          if (!store.user.xsrfToken) {
            await api.getXsrfToken();
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
        <Header handleOpenChat={handleOpenChat} />
        {openChat.shouldOpenMaximizedChat === true && (
          <ChatBox
            recipientEmail={openChat.recipientEmail!}
            profilePicture={
              openChat.profilePicture !== undefined
                ? openChat.profilePicture
                : null
            }
            onMinimize={() => {
              setOpenChat({
                ...openChat,
                shouldOpenMaximizedChat: false,
                shouldOpenMinimizedChat: true,
              });
            }}
            onClose={() =>
              setOpenChat({
                shouldOpenMaximizedChat: false,
                shouldOpenMinimizedChat: false,
                recipientEmail: undefined,
                profilePicture: undefined,
                name: undefined,
                surname: undefined,
                profile: undefined,
              })
            }
            name={openChat.name ?? ""}
            surname={openChat.surname ?? ""}
            profile={t(openChat.profile ?? "")}
          />
        )}
        {openChat.shouldOpenMinimizedChat === true && (
          <ChatMinimized
            name={openChat.name!}
            surname={openChat.surname!}
            profile={t(openChat.profile ?? "")}
            onClose={() =>
              setOpenChat({
                shouldOpenMaximizedChat: false,
                shouldOpenMinimizedChat: false,
                recipientEmail: undefined,
                profilePicture: undefined,
                name: undefined,
                surname: undefined,
                profile: undefined,
              })
            }
            onMaximize={() => {
              setOpenChat({
                ...openChat,
                shouldOpenMaximizedChat: true,
                shouldOpenMinimizedChat: false,
              });
            }}
          />
        )}
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
                  <Route path="/cares" element={<CareList />} />
                  <Route path="/care/:careId" element={<CareDetails />} />
                  <Route
                    path="/profile-selection"
                    element={
                      <ProfileSelection isUserDataFetched={isUserDataFetched} />
                    }
                  />
                  <Route
                    path="/profile-caretaker/:caretakerEmail"
                    element={
                      <CaretakerProfile handleOpenChat={handleOpenChat} />
                    }
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </Content>
      </Layout>
    );
  }
});

export default App;
