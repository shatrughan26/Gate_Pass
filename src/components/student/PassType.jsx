import { useNavigate } from "react-router-dom";

export default function PassType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Select Pass Type
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/student/form?type=local")}
            className="w-full py-3 bg-green-600 text-white rounded-lg"
          >
            Local Pass
          </button>

          <button
            onClick={() => navigate("/student/form?type=home")}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg"
          >
            Home Pass
          </button>
        </div>
      </div>
    </div>
  );
}
