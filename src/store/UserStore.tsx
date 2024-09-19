import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";
import { getCookie, removeCookie } from "typescript-cookie";

export type Profile = "Client" | "Caretaker" | null;

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

  saveProfileToStorage(profile?: UserProfile | null) {
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

  setSelectedProfile(selected_profile?: Profile) {
    if (this.profile && selected_profile) {
      this.profile.selected_profile = selected_profile;
    }
  }

  reset() {
    this.profile = null;
    localStorage.removeItem("user");
    removeCookie("XSRF-TOKEN");
  }
}

export default UserStore;
