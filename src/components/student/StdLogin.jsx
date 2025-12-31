import { useState } from "react";
import { useNavigate } from "react-router-dom";
import asuLogo from "../../assets/asu-logo.png";

export default function StudentLogin() {
  const [enrollment, setEnrollment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const DEMO_ENROLLMENT = "ASU2023001";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!enrollment) {
      setError("Please enter enrollment number");
      return;
    }

    // Demo login check
    if (enrollment === DEMO_ENROLLMENT) {
      navigate("/student/pass-type");
    } else {
      setError("Invalid enrollment number (use demo ID)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* University Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={asuLogo}
              alt="Apeejay Stya University Logo"
              className="w-24 h-24 object-contain rounded-full shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Apeejay Stya University
            </h1>
            <h2 className="text-lg text-gray-600 mt-1">
              Hostel & Home Pass
            </h2>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Number
              </label>
              <input
                type="text"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter enrollment number"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md"
            >
              Login
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Demo Enrollment: <span className="font-semibold">ASU2023001</span>
          </p>

        </div>
      </div>
    </div>
  );
}
