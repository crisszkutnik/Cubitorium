import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { web3Layer } from "../modules/web3/web3Layer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUserStore } from "../modules/store/userStore";

export function LoginButton() {
  const wallet = useAnchorWallet();
  const { setIsLogged, isLogged, reset } = useUserStore();

  useEffect(() => {
    if (wallet) {
      web3Layer.setWallet(wallet);
      setIsLogged(true);
    }

    if (wallet === undefined && isLogged) {
      reset();
    }
  }, [wallet, setIsLogged]);

  return <WalletMultiButton />;
}
