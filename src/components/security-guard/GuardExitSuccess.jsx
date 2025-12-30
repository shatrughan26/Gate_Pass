import { useNavigate } from "react-router-dom";

const GuardExitSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">
        Exit Recorded Successfully
      </h2>
      <p className="text-gray-600 mb-6">
        Student has exited the campus.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        Back to Login
      </button>
    </div>
  );
};

export default GuardExitSuccess;
