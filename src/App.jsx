import StudentLogin from "./components/student/StdLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuardLogin from "./components/security-guard/Login.jsx";
import GuardScanner from "./components/security-guard/Scanner.jsx";
import StudentDetails from "./components/security-guard/StudentDetails.jsx";
import GuardExitSuccess from "./components/security-guard/GuardExitSuccess.jsx";

function App() {
  return (
     <BrowserRouter>
      <Routes>

        {/* Student Routes */}
        <Route path="/" element={<StudentLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />

        {/* Guard Routes */}
        <Route path="/guard/login" element={<GuardLogin />} />
        <Route path="/guard/scan" element={<GuardScanner />} />
        <Route path="/guard/student" element={<StudentDetails />} />
        <Route path="/guard/success" element={<GuardExitSuccess />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
