import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* Warden Components */
import WardenLogin from "./components/warden/Wardenlogin";
import WardenDashboard from "./components/warden/WardenDashboard";
import WardenPortal from "./components/warden/Studentinfo";
import StudentRequest from "./components/warden/StudentRequest";
import EditStudent from "./components/warden/EditStudent";
import StudentCard from "./components/warden/StudentCard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Student Components */
import StudentLogin from "./components/student/StdLogin";
import StudentDashboard from "./components/student/Studentdashboard";
import StudentForm from "./components/student/StudentForm";

/* Guard Components */
import GuardLogin from "./components/security-guard/GuardLogin";
import GuardDashboard from "./components/security-guard/GuardDashboard";
import GuardScanner from "./components/security-guard/Scanner";
import StudentDetails from "./components/security-guard/StudentDetails";
import GuardExitSuccess from "./components/security-guard/GuardExitSuccess";

/* Common */
import UserSelect from "./components/Userselect";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default */}
        <Route path="/" element={<UserSelect />} />

        {/* ---------------- WARDEN ROUTES ---------------- */}
        <Route path="/warden/login" element={<WardenLogin />} />
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/student-info" element={<WardenPortal />} />
        <Route path="/warden/requests" element={<StudentRequest />} />
        <Route path="/edit-student/:enrollment" element={<EditStudent />} />
        <Route path="/student-details/:enrollment" element={<StudentCard />} />

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/form" element={<StudentForm />} />

        {/* ---------------- GUARD ROUTES ---------------- */}
        <Route path="/guard/login" element={<GuardLogin />} />
        <Route path="/guard/dashboard" element={<GuardDashboard />} />
        <Route path="/guard/scan" element={<GuardScanner />} />
        <Route path="/guard/student" element={<StudentDetails />} />
        <Route path="/guard/success" element={<GuardExitSuccess />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
