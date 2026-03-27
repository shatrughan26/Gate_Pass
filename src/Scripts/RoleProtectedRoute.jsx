import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

// Simple loading spinner
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const RoleProtectedRoute = ({ children, allowedRole, redirectTo }) => {
  const { currentUser, role, loading } = useAuth();

  // ⏳ Auth still resolving
  if (loading) {
    return <Loader />;
  }

  // ❌ Not logged in
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  /**
   * ⏳ Logged in but role not loaded yet
   * This is the critical part that fixes your issue
   */
  if (role === null) {
    return <Loader />;
  }

  // ❌ Logged in but wrong role
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
};

export default RoleProtectedRoute;
