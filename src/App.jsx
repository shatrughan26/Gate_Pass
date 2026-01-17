import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./Context/AuthContext";
import RoleProtectedRoute from "./Scripts/RoleProtectedRoute";

/* ---------- COMMON ---------- */
import UserSelect from "./components/Userselect";
import HomeRedirect from "./HomeRedirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- WARDEN ---------- */
import WardenLogin from "./components/warden/Wardenlogin";
import WardenDashboard from "./components/warden/WardenDashboard";
import WardenPortal from "./components/warden/Studentinfo";
import StudentRequest from "./components/warden/StudentRequest";
import EditStudent from "./components/warden/EditStudent";
import StudentCard from "./components/warden/StudentCard";

/* ---------- STUDENT ---------- */
import StudentLogin from "./components/student/StdLogin";
import StudentDashboard from "./components/student/Studentdashboard";
import StudentForm from "./components/student/StudentForm";

/* ---------- GUARD ---------- */
import GuardLogin from "./components/security-guard/GuardLogin";
import GuardDashboard from "./components/security-guard/GuardDashboard";
import GuardScanner from "./components/security-guard/Scanner";
import StudentDetails from "./components/security-guard/StudentDetails";
import GuardExitSuccess from "./components/security-guard/GuardExitSuccess";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />

        <Routes>
          {/* ---------- SMART ROOT ---------- */}
          <Route path="/" element={<HomeRedirect />} />

          {/* ---------- USER SELECTION ---------- */}
          <Route path="/select" element={<UserSelect />} />

          {/* ---------- WARDEN ---------- */}
          <Route path="/warden/login" element={<WardenLogin />} />

          <Route
            path="/warden/dashboard"
            element={
              <RoleProtectedRoute
                allowedRole="warden"
                redirectTo="/warden/login"
              >
                <WardenDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/student-info"
            element={
              <RoleProtectedRoute
                allowedRole="warden"
                redirectTo="/warden/login"
              >
                <WardenPortal />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/warden/requests"
            element={
              <RoleProtectedRoute
                allowedRole="warden"
                redirectTo="/warden/login"
              >
                <StudentRequest />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/edit-student/:enrollment"
            element={
              <RoleProtectedRoute
                allowedRole="warden"
                redirectTo="/warden/login"
              >
                <EditStudent />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/student-details/:enrollment"
            element={
              <RoleProtectedRoute
                allowedRole="warden"
                redirectTo="/warden/login"
              >
                <StudentCard />
              </RoleProtectedRoute>
            }
          />

          {/* ---------- STUDENT ---------- */}
          <Route path="/student/login" element={<StudentLogin />} />

          <Route
            path="/student/dashboard"
            element={
              <RoleProtectedRoute
                allowedRole="student"
                redirectTo="/student/login"
              >
                <StudentDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/student/form"
            element={
              <RoleProtectedRoute
                allowedRole="student"
                redirectTo="/student/login"
              >
                <StudentForm />
              </RoleProtectedRoute>
            }
          />

          {/* ---------- GUARD ---------- */}
          <Route path="/guard/login" element={<GuardLogin />} />

          <Route
            path="/guard/dashboard"
            element={
              <RoleProtectedRoute
                allowedRole="guard"
                redirectTo="/guard/login"
              >
                <GuardDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/guard/scan"
            element={
              <RoleProtectedRoute
                allowedRole="guard"
                redirectTo="/guard/login"
              >
                <GuardScanner />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/guard/student"
            element={
              <RoleProtectedRoute
                allowedRole="guard"
                redirectTo="/guard/login"
              >
                <StudentDetails />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/guard/success"
            element={
              <RoleProtectedRoute
                allowedRole="guard"
                redirectTo="/guard/login"
              >
                <GuardExitSuccess />
              </RoleProtectedRoute>
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
