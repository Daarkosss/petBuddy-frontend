import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080/",
  realm: "pet-buddy",
  clientId: "pet-buddy-client",
});

export default keycloak;