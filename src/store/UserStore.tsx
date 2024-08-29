import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";
import { getCookie, removeCookie } from "typescript-cookie";

type Profile = "Client" | "Caretaker" | null;

export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  selected_profile: Profile;
}

class UserStore {
  profile: UserProfile | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadProfileFromStorage();
  }

  get jwtToken(): string | undefined {
    return keycloak.token;
  }

  get xsrfToken(): string | undefined {
    return getCookie("XSRF-TOKEN");
  }

  saveProfileToStorage(profile?: UserProfile) {
    if (profile) {
      this.profile = profile;
      localStorage.setItem("user", JSON.stringify(this.profile));
    }
  }

  loadProfileFromStorage() {
    this.profile = this.getProfileFromStorage();
  }

  getProfileFromStorage() {
    const profile = localStorage.getItem("profile");
    if (profile) {
      return JSON.parse(profile);
    } else {
      return null;
    }
  }

  reset() {
    this.profile = null;
    localStorage.removeItem("user");
    removeCookie("XSRF-TOKEN");
  }
}

export default UserStore;
