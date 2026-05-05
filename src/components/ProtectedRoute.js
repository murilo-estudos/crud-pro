import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Se não houver um usuário logado, redireciona para a página de login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Se houver um usuário, renderiza os "filhos" (que será o Dashboard)
  return children;
};

export default ProtectedRoute;