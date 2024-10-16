import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";

class RootStore {
  user: UserStore;
  private _isStarting = true;
  private _selectedMenuOption = "";

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

  get selectedMenuOption() {
    return this._selectedMenuOption;
  }

  set selectedMenuOption(option: string) {
    this._selectedMenuOption = option;
  }
}

export default new RootStore();
