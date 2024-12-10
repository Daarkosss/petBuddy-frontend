import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { toast } from "react-toastify";
import i18next from "i18next";
import { AccountDataDTO } from "../types";

class BlockedUsersStore {
  users: AccountDataDTO[] = [];
  visitedUserEmail: string = "";
  searchValue: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  fetchBlockedUsers = async () => {
    try {
      const blockedUsers = await api.getBlockedUsers();
      if (blockedUsers) {
        this.users = blockedUsers;
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  get filteredUsers() {
    if (this.searchValue !== "") {
      const loweredSearchedValue = this.searchValue.toLocaleLowerCase();
      return this.users.filter((blockedUser) =>
        blockedUser.email.toLocaleLowerCase().match(loweredSearchedValue) ||
        blockedUser.name.toLocaleLowerCase().match(loweredSearchedValue) ||
        blockedUser.surname.toLocaleLowerCase().match(loweredSearchedValue)
      );
    } else {
      return this.users;
    }
  }

  get isVisitedUserBlocked() {
    return this.users.some((blockedUser) => blockedUser.email === this.visitedUserEmail);
  }

  blockUser = async (userEmail: string) => {
    try {
      await api.blockUser(userEmail);
      this.fetchBlockedUsers();
      toast.success(i18next.t("success.blockUser"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(i18next.t("error.blockUser"));
        console.error(e.message);
      }
    }
  };
  
  unblockUser = async (userEmail: string) => {
    try {
      await api.unblockUser(userEmail);
      this.users = this.users.filter((user) => user.email !== userEmail);
      toast.success(i18next.t("success.unblockUser"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(i18next.t("error.unblockUser"));
        console.error(e.message);
      }
    }
  };
  
  isBlockedByUser = (otherUserEmail: string) => {
    return this.users?.some((blockedUser) => blockedUser.email === otherUserEmail);
  };

  reset = () => {
    this.users = [];
  };
}

export default BlockedUsersStore;
