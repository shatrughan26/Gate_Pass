import { useNavigate } from "react-router-dom";

const GuardScanner = () => {
  const navigate = useNavigate();

  const mockScan = () => {
    navigate("/guard/student");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-semibold mb-6">Scan Student QR</h2>

      <div className="w-72 h-72 border-4 border-dashed border-gray-400 rounded-xl flex items-center justify-center bg-white">
        <p className="text-gray-500 text-center">
          Camera Preview <br /> (QR Scanner)
        </p>
      </div>

      <button
        onClick={mockScan}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Simulate Scan
      </button>
    </div>
  );
};

export default GuardScanner;
