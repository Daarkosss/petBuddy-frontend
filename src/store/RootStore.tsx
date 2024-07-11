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

  constructor() {
    makeAutoObservable(this);
  }

  get userToken(): string | undefined {
    return keycloak.token
  }
}

export default new RootStore();
