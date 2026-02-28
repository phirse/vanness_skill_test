import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';
import type { Role } from '../types';

interface Props {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
