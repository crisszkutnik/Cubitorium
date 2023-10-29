import { NavLink } from 'react-router-dom';
import { useUserStore } from '../../modules/store/userStore';
import { UserActionButton } from './UserActionButton';
import { LoginButton } from './LoginButton';

export function Navbar() {
  const { isLogged } = useUserStore();

  return (
    <nav className="flex text-text-primary border-b-2">
      <div className="flex items-center">
      <NavLink to="/" className="flex items-center text-md p-4">
        <img className="h-12" src="/public/Logo.png"/>
        <h1 className="text-2xl font-semibold">Cubitorium</h1>
      </NavLink>
      </div>
      <div className="flex ml-5">
        <NavLink to="/" className="flex items-center text-md p-4">
          Home
        </NavLink>
        <NavLink to="/algorithms" className="flex items-center text-md p-4">
          Algorithms
        </NavLink>
        <NavLink to="/practice" className="flex items-center text-md p-4">
          Practice
        </NavLink>
        <NavLink to="/algorithms/upload"className="flex items-center text-md p-4">
          Upload your Algorithm
        </NavLink>
        <NavLink to="/guides"className="flex items-center text-md p-4">
          Guides
        </NavLink>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center">
        {isLogged ? <UserActionButton /> : <LoginButton />}
      </div>
    </nav>
  );
}
