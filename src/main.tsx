import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloack.ts";
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import './scss/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        theme='colored'
      />
    </BrowserRouter>
  </ReactKeycloakProvider>
)
