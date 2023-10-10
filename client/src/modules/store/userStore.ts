import { UserInfo, UserInfoWithPk } from '../types/userInfo.interface';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';
import { createWithEqualityFn } from 'zustand/traditional';
import { web3Layer } from '../web3/web3Layer';
import { AnchorWallet } from '@solana/wallet-adapter-react';

type SendUserInfoType = (
  name: string,
  surname: string,
  wcaId: string,
  location: string,
) => Promise<void>;

interface UserStoreState {
  users: UserInfoWithPk[];
  isLogged: boolean;
  loggedUserPk: string | undefined;
  setLoggedUserPk: (publicKey: string | undefined) => void;
  setIsLogged: (isLogged: boolean) => void;
  addOrUpdateUser: (publicKey: PublicKey | string, userInfo: UserInfo) => void;
  loadUser: (publicKey: PublicKey | string) => Promise<void>;
  login: (wallet: AnchorWallet) => void;
  logout: () => void;
  sendUserInfo: SendUserInfoType;
}

export const userSelector = (publicKey: PublicKey | string) => {
  return (state: UserStoreState) => {
    const user = state.users.find(
      (u) => u.publicKey === getStringFromPKOrObject(publicKey),
    );

    if (!user) {
      state.loadUser(publicKey);
    }

    return user;
  };
};

export const loggedUserSelector = (state: UserStoreState) => {
  return state.users.find((u) => u.publicKey === state.loggedUserPk);
};

export const useUserStore = createWithEqualityFn<UserStoreState>(
  (set, get) => ({
    users: [],
    isLogged: false,
    loggedUserPk: undefined,

    setLoggedUserPk: (publicKey: string | undefined) => {
      set({ loggedUserPk: publicKey });
    },
    setIsLogged: (isLogged: boolean) => set({ isLogged }),

    addOrUpdateUser: (publicKey: PublicKey | string, userInfo: UserInfo) => {
      const key = getStringFromPKOrObject(publicKey);
      const users = get().users;
      const idx = users.findIndex((u) => u.publicKey === key);

      const obj = { ...userInfo, publicKey: key };

      if (idx >= 0) {
        users[idx] = obj;
        set({ users: [...users] });
      } else {
        set({
          users: [...users, obj],
        });
      }
    },

    loadUser: async (publicKey: PublicKey | string) => {
      const fetchedUser = await web3Layer.getUserInfo(publicKey);

      if (fetchedUser) {
        get().addOrUpdateUser(publicKey, fetchedUser);
      }
    },

    login: async (wallet: AnchorWallet) => {
      web3Layer.setWallet(wallet);

      const pk = wallet.publicKey.toString();

      type SetType = Pick<UserStoreState, 'isLogged' | 'loggedUserPk'> &
        Partial<Pick<UserStoreState, 'users'>>;

      const setObj: SetType = {
        isLogged: true,
        loggedUserPk: pk,
      };

      let user;
      try {
        user = await web3Layer.getUserInfo(pk);

        setObj.users = [
          ...get().users,
          {
            ...user,
            publicKey: pk,
          },
        ];
      } catch (e) {
        console.log('Account PDA does not exist');
      }

      set(setObj);
    },

    logout: () => {
      set({
        isLogged: false,
        loggedUserPk: undefined,
        users: get().users.filter((u) => u.publicKey === get().loggedUserPk),
      });
    },

    sendUserInfo: async (
      name: string,
      surname: string,
      wcaId: string,
      location: string,
    ) => {
      const state = get();

      if (state.loggedUserPk === undefined) {
        return;
      }

      const oldUser = state.users.find(
        (u) => u.publicKey === get().loggedUserPk,
      );

      if (oldUser) {
        await web3Layer.changeUserInfo(name, surname, wcaId, location);
      } else {
        await web3Layer.sendUserInfo(name, surname, wcaId, location);
      }

      await get().loadUser(state.loggedUserPk);
    },
  }),
  Object.is,
);
