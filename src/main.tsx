import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloack.ts";
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx'
import './scss/main.scss';

const keycloakInitOptions = {
  onLoad: 'check-sso',
  pkceMethod: 'S256',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        theme='colored'
      />
    </BrowserRouter>
  </ReactKeycloakProvider>
)
