import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


// Accepts adminOnly or roles (array of allowed roles)
const ProtectedRoute = ({ children, adminOnly = false, roles = null }) => {
  const { auth } = useAuth();

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  // If roles prop is provided, check against allowed roles
  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  // If adminOnly, allow admin, super-admin, recruiter, hr_manager
  if (adminOnly && !['admin', 'super-admin', 'recruiter', 'hr_manager'].includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;