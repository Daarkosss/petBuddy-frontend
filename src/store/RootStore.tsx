import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";

class RootStore {
  user: UserStore;
  _isStarting: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.user = new UserStore();
  }

  reset() { 
    this.user.reset();
  }

  get isStarting() {
    return this._isStarting;
  }

  set isStarting(value: boolean) {
    this._isStarting = value;
  }
}

export default new RootStore();
