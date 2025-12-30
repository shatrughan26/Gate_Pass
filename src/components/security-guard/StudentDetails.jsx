import { useNavigate } from "react-router-dom";

const StudentDetails = () => {
  const navigate = useNavigate();

  const confirmExit = () => {
    navigate("/guard/success");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Student Details
        </h3>

        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> Rahul Sharma</p>
          <p><strong>Roll No:</strong> 21CS045</p>
          <p><strong>Pass Type:</strong> Home Pass</p>
          <p><strong>Destination:</strong> Jaipur</p>
          <p><strong>Approved By:</strong> Warden A</p>
        </div>

        <button
          onClick={confirmExit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Confirm Exit
        </button>
      </div>
    </div>
  );
};

export default StudentDetails;
