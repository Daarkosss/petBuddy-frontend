import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";
import AnimalStore from "./AnimalStore";

class RootStore {
  user: UserStore;
  animal: AnimalStore;
  private _isStarting = true;
  private _selectedMenuOption = "";

  constructor() {
    makeAutoObservable(this);
    this.user = new UserStore();
    this.animal = new AnimalStore();
  }

  reset() { 
    this.user.reset();
    this.animal.reset();
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
