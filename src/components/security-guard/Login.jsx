import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuardLogin = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Guard Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Guard ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={guardId}
            onChange={(e) => setGuardId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuardLogin;
