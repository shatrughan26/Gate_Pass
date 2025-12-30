import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WardenLogin from "./components/warden/Wardenlogin";
import WardenDashboard from "./components/warden/WardenDashboard";
import WardenPortal from "./components/warden/Studentinfo";
import GuardLogin from "./components/security-guard/Login.jsx";
import GuardScanner from "./components/security-guard/Scanner.jsx";
import StudentDetails from "./components/security-guard/StudentDetails.jsx";
import GuardExitSuccess from "./components/security-guard/GuardExitSuccess.jsx";
import StudentLogin from "./components/student/StdLogin"; // make sure this exists

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Warden Routes */}
        <Route path="/login" element={<WardenLogin />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/student-info" element={<WardenPortal />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />

        {/* Guard Routes */}
        <Route path="/guard/login" element={<GuardLogin />} />
        <Route path="/guard/scan" element={<GuardScanner />} />
        <Route path="/guard/student" element={<StudentDetails />} />
        <Route path="/guard/success" element={<GuardExitSuccess />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
