import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

export function WalletContext({ children }: Props) {
  const wallets = [new PhantomWalletAdapter()];

  // Bypass tunnel
  axios
    .options('https://f76d-190-19-74-199.ngrok-free.app/', {
      headers: {
        'ngrok-skip-browser-warning': 'ben',
      },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));

  return (
    <ConnectionProvider endpoint="https://f76d-190-19-74-199.ngrok-free.app/">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
