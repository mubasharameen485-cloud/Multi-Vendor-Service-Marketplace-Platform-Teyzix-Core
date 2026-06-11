import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
   
    if (user.role === 'CUSTOMER') return <Navigate to="/customer-dashboard" replace />;
    if (user.role === 'SERVICE_PROVIDER') return <Navigate to="/provider-dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;