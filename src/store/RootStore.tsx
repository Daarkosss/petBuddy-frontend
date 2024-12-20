import { makeAutoObservable } from "mobx";
import UserStore from "./UserStore";
import AnimalStore from "./AnimalStore";
import NotificationStore from "./NotificationStore";
import BlockedUsersStore from "./BlockedUsers";

class RootStore {
  user: UserStore;
  animal: AnimalStore;
  notification: NotificationStore;
  blocked: BlockedUsersStore;
  private _isStarting = true;
  private _selectedMenuOption = "";

  constructor() {
    makeAutoObservable(this);
    this.user = new UserStore();
    this.animal = new AnimalStore();
    this.notification = new NotificationStore();
    this.blocked = new BlockedUsersStore();
  }

  reset() { 
    this.user.reset();
    this.animal.reset();
    this.notification.reset();
    this.blocked.reset();
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
