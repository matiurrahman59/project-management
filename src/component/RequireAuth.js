import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const RequireAuth = () => {
  const { user } = useAuthContext();

  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default RequireAuth;
