import { NavLink } from "react-router-dom";
import { useUserStore } from "../../modules/store/userStore";
import { UserActionButton } from "./UserActionButton";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { web3Service } from "../../modules/service/web3Service";
import { LoginButton } from "./LoginButton";

export function Navbar() {
  const { isLogged } = useUserStore();
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      web3Service.login(wallet);
    } else if (isLogged) {
      web3Service.logout();
    }
  }, [wallet]);

  return (
    <nav className="flex text-text-primary border-b-2">
      <div className="flex items-center">
        <img className="h-12" src="/public/Logo.png" />
        <h1 className="text-2xl font-semibold">Cubitorium</h1>
      </div>
      <div className="flex ml-5">
        <NavLink to="/" className="flex items-center text-md p-4">
          Home
        </NavLink>
        <NavLink to="/algorithms" className="flex items-center text-md p-4">
          Algorithms
        </NavLink>
        <NavLink to="/" className="flex items-center text-md p-4">
          Practice
        </NavLink>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center">
        {isLogged ? <UserActionButton /> : <LoginButton />}
      </div>
    </nav>
  );
}
