import UserStore from "./UserStore";

class RootStore {
  user: UserStore;

  constructor() {
    this.user = new UserStore();
  }

  reset() { 
    this.user.reset();
  }
}

export default new RootStore();
