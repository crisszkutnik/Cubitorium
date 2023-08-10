import { NavLink } from "react-router-dom";
import { LoginButton } from "./LoginButton";

export function Navbar() {
  return (
    <nav className="flex text-text-primary border-b-2">
      <div className="flex items-center">
        <img className="h-12" src="/public/Logo.png" />
        <h1 className="text-2xl font-medium">Cubitorium</h1>
      </div>
      <div className="flex ml-5">
        <NavLink to="/" className="flex items-center text-md p-4">
          Algoritmos
        </NavLink>
        <NavLink to="/" className="flex items-center text-md p-4">
          Practicar
        </NavLink>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center mr-4">
        <LoginButton />
      </div>
    </nav>
  );
}
