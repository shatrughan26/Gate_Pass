import { useNavigate } from "react-router-dom";

export default function UserSelect() {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const role = e.target.value;

    if (role === "student") navigate("/student/login");
    if (role === "warden") navigate("/login");
    if (role === "guard") navigate("/guard/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Select User Type</h2>

        <select
          onChange={handleChange}
          defaultValue=""
          className="w-full py-2 px-4 border border-blue-300 rounded-lg text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        >
          <option value="" disabled>
            -- Choose Role --
          </option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
          <option value="guard">Guard</option>
        </select>
      </div>
    </div>
  );
}
