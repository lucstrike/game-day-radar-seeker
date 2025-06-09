import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import AppLayout from '../common/Layout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Renderiza o layout principal que envolve as páginas protegidas
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoute;