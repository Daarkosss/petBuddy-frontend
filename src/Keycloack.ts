import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://74.248.81.129:8080/",
  realm: "pet-buddy",
  clientId: "pet-buddy-client",
});

export default keycloak;