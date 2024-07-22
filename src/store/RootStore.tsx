import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";
import { getCookie, removeCookie } from "typescript-cookie";

export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string
  token?: string;
}

class RootStore {

  constructor() {
    makeAutoObservable(this);
  }

  get userToken(): string | undefined {
    return keycloak.token
  }

  get xsrfToken(): string | undefined {
    return getCookie("XSRF-TOKEN");
  }

  reset = () => {
    removeCookie('XSRF-TOKEN');
  }
}

export default new RootStore();
