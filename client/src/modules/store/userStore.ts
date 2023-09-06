import { create } from 'zustand';
import { UserInfo } from '../types/userInfo.interface';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';
import { PublicKeyString } from '../types/publicKeyString.type';

interface UserStoreState {
  users: Record<PublicKeyString, UserInfo>;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
  setUser: (publicKey: PublicKey | string, userInfo: UserInfo) => void;
  getUser: (publicKey: PublicKey | string | undefined) => UserInfo | undefined;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: {},
  isLogged: false,
  setIsLogged: (isLogged: boolean) => set({ isLogged }),
  setUser: (publicKey: PublicKey | string, userInfo: UserInfo) => {
    const key = getStringFromPKOrObject(publicKey);
    const users = get().users;

    if (users[key] !== undefined && users[key] !== null) {
      return;
    }

    set({
      users: {
        ...users,
        [key]: userInfo,
      },
    });
  },
  getUser: (
    publicKey: PublicKey | string | undefined,
  ): UserInfo | undefined => {
    if (publicKey === undefined) {
      return undefined;
    }

    const key = getStringFromPKOrObject(publicKey);
    return get().users[key];
  },
  logout: () =>
    set({
      isLogged: false,
    }),
}));
