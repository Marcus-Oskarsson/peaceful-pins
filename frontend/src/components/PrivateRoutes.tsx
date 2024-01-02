import { Navigate, Outlet } from 'react-router-dom';
import { useAuthCheck } from '@services/authenticationService';

export default function PrivateRoutes() {
  const authCheck = useAuthCheck();

  if (authCheck.isLoading) return null;
  if (authCheck.isError) return <Navigate to="/login" replace />;

  return <Outlet />;
}
