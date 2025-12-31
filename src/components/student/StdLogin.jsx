import { useState } from "react";
import { useNavigate } from "react-router-dom";
import asuLogo from "../../assets/asu-logo.png";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const DEMO_ENROLLMENT = "ASU2023001";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!enrollment) {
      setError("Please enter enrollment number");
      return;
    }

    if (enrollment === DEMO_ENROLLMENT) {
      setIsLoggedIn(true);
    } else {
      setError("Invalid enrollment number (use demo ID)");
    }
  };

  const handlePassSelect = (type) => {
    navigate(`/student/form?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={asuLogo}
              alt="Apeejay Stya University Logo"
              className="w-24 h-24 object-contain rounded-full shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Apeejay Stya University
            </h1>
            <h2 className="text-lg text-gray-600 mt-1">
              Hostel & Home Pass
            </h2>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* LOGIN PHASE */}
          {!isLoggedIn && (
            <form onSubmit={handleLogin}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Number
              </label>

              <input
                type="text"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter enrollment number"
              />

              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md"
              >
                Login
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Demo Enrollment: <span className="font-semibold">ASU2023001</span>
              </p>
            </form>
          )}

          {/* PASS TYPE PHASE */}
          {isLoggedIn && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-4">
                Select Pass Type
              </h3>

              <button
                onClick={() => handlePassSelect("local")}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Local Pass
              </button>

              <button
                onClick={() => handlePassSelect("home")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Home Pass
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
