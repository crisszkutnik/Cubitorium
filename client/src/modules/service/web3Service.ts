import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "../store/userStore";
import { web3Layer } from "../web3/web3Layer";

async function sendUserInfo(name: string, surname: string) {
  await web3Layer.sendUserInfo(name, surname);
}

async function getUserInfo(primaryKey: string) {
  const { getUser, addUser } = useUserStore.getState();

  const user = getUser(primaryKey);

  if (user) {
    return user;
  }

  const fetchedUser = await web3Layer.getUserInfo(primaryKey);

  addUser(primaryKey, fetchedUser);
  return fetchedUser;
}

async function login(wallet: AnchorWallet) {
  const { setIsLogged } = useUserStore.getState();
  web3Layer.setWallet(wallet);
  setIsLogged(true);
}

async function logout() {
  const { setIsLogged } = useUserStore.getState();
  web3Layer.reset();
  setIsLogged(false);
}

export const web3Service = {
  sendUserInfo,
  getUserInfo,
  login,
  logout,
};
