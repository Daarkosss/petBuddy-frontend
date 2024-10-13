import ReactDOM from "react-dom/client"
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloack.ts";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./i18n";
import App from "./App.tsx"
import "./scss/main.scss";
import SplashScreen from "./pages/SplashScreen.tsx";

const keycloakInitOptions = {
  onLoad: "check-sso",
  silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  pkceMethod: "S256"
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        theme="colored"
      />
      <SplashScreen />
    </BrowserRouter>
  </ReactKeycloakProvider>
)
