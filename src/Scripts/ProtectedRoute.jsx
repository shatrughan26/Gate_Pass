import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

const ProtectedRoute = ({ children, redirectTo }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

