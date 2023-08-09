import { create } from "zustand";
import { UserInfo } from "../types/userInfo.interface";

interface UserStoreState {
  userInfo: UserInfo;
  isLogged: boolean;
  setUserInfo: (UserInfo: UserInfo) => void;
  setIsLogged: (isLogged: boolean) => void;
  reset: () => void;
}

function getInitialUserInfo() {
  return {
    name: "",
    surname: "",
    bump: -1,
  };
}

export const useUserStore = create<UserStoreState>((set) => ({
  userInfo: getInitialUserInfo(),
  isLogged: false,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
  setIsLogged: (isLogged: boolean) => set({ isLogged }),
  reset: () => {
    set({
      userInfo: getInitialUserInfo(),
      isLogged: false,
    });
  },
}));
