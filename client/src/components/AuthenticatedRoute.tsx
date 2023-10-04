import { useUserStore } from '../modules/store/userStore';
import { useAlertContext } from './context/AlertContext';
import { Navigate, Outlet } from 'react-router-dom';

export function AuthenticatedRoute() {
  const isLogged = useUserStore((state) => state.isLogged);
  const { error } = useAlertContext();

  if (isLogged) {
    return <Outlet />;
  }

  error('You have to be logged to view this page!');
  return <Navigate to="/" />;
}
