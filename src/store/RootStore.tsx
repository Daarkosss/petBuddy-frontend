import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";

export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string
  token?: string;
}

class RootStore {
  xsrfToken: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get userToken(): string | undefined {
    return keycloak.token
  }

  get getXsrfToken(): string | undefined {
    return this.xsrfToken
  }

  setXsrfToken(token: string): void {
    this.xsrfToken = token
  }

}

export default new RootStore();
