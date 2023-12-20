import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRoutes() {
  const token = document.cookie;
  if (!token) return <Navigate to="/login" replace />;

  const decodedToken: { role: string; iat: number; exp: number } =
    jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) return <Navigate to="/login" replace />;

  return <Outlet />;
}
