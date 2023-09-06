import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "../store/userStore";
import { web3Layer } from "../web3/web3Layer";

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
  login,
  logout,
};
