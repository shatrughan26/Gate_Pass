import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WardenLogin from "./components/warden/WardenLogin";
import WardenDashboard from "./components/warden/WardenDashboard";
import WardenPortal from "./components/warden/Studentinfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<WardenLogin />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />

        <Route path="/student-info" element={<WardenPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
