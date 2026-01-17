import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

export default function HomeRedirect() {
  const { currentUser, role, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/select" replace />;
  }

  if (role === "warden") {
    return <Navigate to="/warden/dashboard" replace />;
  }

  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (role === "guard") {
    return <Navigate to="/guard/dashboard" replace />;
  }

  return <Navigate to="/select" replace />;
}
