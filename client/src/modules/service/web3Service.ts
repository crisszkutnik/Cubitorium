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

export const web3Service = {
  sendUserInfo,
  getLoggedUserInfo,
};
