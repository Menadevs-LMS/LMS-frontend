import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children, redirectPath }) => {
  const token = localStorage.getItem("accessToken");
  let userRole = '';
  
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      userRole = parsedUser.role || '';
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;