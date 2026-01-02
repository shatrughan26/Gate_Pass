import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WardenLogin from "./components/warden/Wardenlogin";
import WardenDashboard from "./components/warden/WardenDashboard";
import WardenPortal from "./components/warden/Studentinfo";
import GuardLogin from "./components/security-guard/Login.jsx";
import GuardScanner from "./components/security-guard/Scanner.jsx";
import StudentDetails from "./components/security-guard/StudentDetails.jsx";
import GuardExitSuccess from "./components/security-guard/GuardExitSuccess.jsx";
import StudentLogin from "./components/student/StdLogin"; // make sure this exists
import UserSelect from "./components/Userselect.jsx";
import StudentDashboard from "./components/student/Studentdashboard.jsx";
import StudentForm from "./components/student/StudentForm.jsx";
import EditStudent from "./components/warden/EditStudent";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<UserSelect />} />

        {/* Warden Routes */}
        <Route path="/login" element={<WardenLogin />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/student-info" element={<WardenPortal />} />

        <Route path="/edit-student/:enrollment" element={<EditStudent />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/" element={<StudentLogin />} />
        <Route path="/student/form" element={<StudentForm />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Guard Routes */}
        <Route path="/guard/login" element={<GuardLogin />} />
        <Route path="/guard/scan" element={<GuardScanner />} />
        <Route path="/guard/student" element={<StudentDetails />} />
        <Route path="/guard/success" element={<GuardExitSuccess />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
