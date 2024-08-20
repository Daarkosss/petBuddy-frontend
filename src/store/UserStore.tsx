import { makeAutoObservable } from "mobx";
import keycloak from "../Keycloack";
import { getCookie, removeCookie } from "typescript-cookie";

export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

class UserStore {
  profile: UserProfile | null = null;

  //makes object of UserStore type observable and loads user profile
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

  //saves user profile to local storage
  saveProfileToStorage(profile?: UserProfile) {
    if (profile) {
      this.profile = profile;
      localStorage.setItem("user", JSON.stringify(this.profile));
    }
  }

  //loads user profile
  loadProfileFromStorage() {
    this.profile = this.getProfileFromStorage();
  }

  //gets user profile from local storage
  getProfileFromStorage() {
    const profile = localStorage.getItem("profile");
    if (profile) {
      return JSON.parse(profile);
    } else {
      return null;
    }
  }

  //removes user profile from local storage and xsrf token from cookies
  reset() {
    this.profile = null;
    localStorage.removeItem("user");
    removeCookie("XSRF-TOKEN");
  }
}

export default UserStore;
