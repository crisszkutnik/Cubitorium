import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "../store/userStore";
import { web3Layer } from "../web3/web3Layer";

async function sendUserInfo(name: string, surname: string) {
  await web3Layer.sendUserInfo(name, surname);
}

async function getLoggedUserInfo() {
  const { setUserInfo } = useUserStore.getState();
  const userData = await web3Layer.getLoggedUserInfo();

  setUserInfo(userData);
}

async function login(wallet: AnchorWallet) {
  const { setIsLogged } = useUserStore.getState();
  web3Layer.setWallet(wallet);
  setIsLogged(true);
}

async function logout() {
  const { reset } = useUserStore.getState();
  web3Layer.reset();
  reset();
}

export const web3Service = {
  sendUserInfo,
  getLoggedUserInfo,
  login,
  logout,
};
