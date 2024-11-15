import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";
import { getCookie, removeCookie } from "typescript-cookie";
import { api } from "../api/api";
import store from "./RootStore"

export type Profile = "CLIENT" | "CARETAKER" | null;

export interface UserProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  selected_profile: Profile;
  hasCaretakerProfile?: boolean;
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
      localStorage.setItem("profile", JSON.stringify(this.profile));
    }
  }

  loadProfileFromStorage() {
    this.profile = this.getProfileFromStorage();
  }

  getProfileFromStorage(): UserProfile | null {
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
      store.notification.setup();
    }
  }

  set hasCaretakerProfile(value: boolean) {
    if (this.profile) {
      this.profile.hasCaretakerProfile = value;
    }
  }

  reset() {
    this.profile = null;
    localStorage.removeItem("profile");
    removeCookie("XSRF-TOKEN");
  }
}

export default UserStore;
