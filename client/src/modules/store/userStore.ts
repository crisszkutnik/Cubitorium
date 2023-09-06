import { create } from 'zustand';
import { UserInfo } from '../types/userInfo.interface';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';

interface UserStoreState {
  users: { [primaryKey: string]: UserInfo };
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
  addUser: (publicKey: PublicKey | string, userInfo: UserInfo) => void;
  getUser: (publicKey: PublicKey | string) => UserInfo | undefined;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: {},
  isLogged: false,
  setIsLogged: (isLogged: boolean) => set({ isLogged }),
  addUser: (publicKey: PublicKey | string, userInfo: UserInfo) => {
    const key = getStringFromPKOrObject(publicKey);
    set({
      ...get().users,
      [key]: userInfo,
    });
  },
  getUser: (publicKey: PublicKey | string): UserInfo | undefined => {
    const key = getStringFromPKOrObject(publicKey);
    return get().users[key];
  },
}));
