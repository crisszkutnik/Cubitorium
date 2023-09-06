import { AnchorWallet } from '@solana/wallet-adapter-react';
import { useUserStore } from '../store/userStore';
import { web3Layer } from '../web3/web3Layer';
import { userService } from './userService';

async function login(wallet: AnchorWallet) {
  const { setIsLogged, setUser } = useUserStore.getState();
  web3Layer.setWallet(wallet);

  const pk = wallet.publicKey.toString();
  const user = await userService.getUserInfo(pk);

  setIsLogged(true);
  if (user) {
    setUser(pk, user);
  }
}

async function logout() {
  const { logout } = useUserStore.getState();
  web3Layer.reset();
  logout();
}

export const web3Service = {
  login,
  logout,
};
