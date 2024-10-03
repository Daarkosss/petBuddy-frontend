import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";

class RootStore {
  user: UserStore;
  selectedMenuKey = "";

  constructor() {
    makeAutoObservable(this);
    this.user = new UserStore();
  }

  reset() { 
    this.user.reset();
  }
}

export default new RootStore();
