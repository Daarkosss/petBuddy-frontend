import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";

class RootStore {
  user: UserStore;
  private _selectedMenuOption = "";

  constructor() {
    makeAutoObservable(this);
    this.user = new UserStore();
  }

  reset() { 
    this.user.reset();
  }

  get selectedMenuOption() {
    return this._selectedMenuOption;
  }

  set selectedMenuOption(option: string) {
    this._selectedMenuOption = option;
  }
}

export default new RootStore();
