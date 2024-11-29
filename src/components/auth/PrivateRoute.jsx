import { Navigate } from 'react-router-dom';
import { hasPermission } from '../../models/userRoles';

const PrivateRoute = ({ children, userRole, requiredPermission }) => {
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
