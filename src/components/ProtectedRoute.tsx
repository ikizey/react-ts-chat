import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

export type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const currentUser = useContext(AuthContext);

  if (currentUser) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoute;
