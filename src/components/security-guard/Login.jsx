import { useState } from "react";
import { useNavigate } from "react-router-dom";
import asuLogo from "../../assets/asu-logo.png";

export default function GuardLogin() {
  const navigate = useNavigate();
  const [guardId, setGuardId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Frontend-only mock login
    if (guardId && password) {
      navigate("/guard/scan");
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
              Security Guard Login
            </h2>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label
                htmlFor="guardId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Guard ID
              </label>
              <input
                type="text"
                id="guardId"
                value={guardId}
                onChange={(e) => setGuardId(e.target.value)}
                placeholder="Enter your guard ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
