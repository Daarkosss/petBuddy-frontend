import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "../App";
import keycloak from "../Keycloack";


const WrappedApp = () => (
    <ReactKeycloakProvider authClient={keycloak}>
        <App />
    </ReactKeycloakProvider>
);

export default WrappedApp