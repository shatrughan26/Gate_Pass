import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";

const GuardScanner = () => {
  const navigate = useNavigate();

  const [scannedData, setScannedData] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [startScan, setStartScan] = useState(false); // 👈 NEW

  const handleScan = (result) => {
    if (hasScanned) return;

    if (result?.[0]?.rawValue) {
      const qrValue = result[0].rawValue;

      setScannedData(qrValue);
      setHasScanned(true);
      setStartScan(false); // 👈 close camera

      setTimeout(() => {
        navigate("/guard/student", {
          state: { qrData: qrValue },
        });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-semibold mb-6">Scan Student QR</h2>

      <div className="w-72 h-72 rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
        {/* STEP 1: Button before scanner */}
        {!startScan && !hasScanned && (
          <button
            onClick={() => setStartScan(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Scan QR
          </button>
        )}

        {/* STEP 2: Scanner opens */}
        {startScan && !hasScanned && (
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
            constraints={{ facingMode: "environment" }}
          />
        )}

        {/* STEP 3: Success message */}
        {hasScanned && (
          <div className="text-green-600 font-semibold text-center">
            QR Scanned Successfully ✔
          </div>
        )}
      </div>

      {!scannedData && !startScan && (
        <p className="text-gray-500 mt-4 text-center">
          Click “Scan QR” to open the camera
        </p>
      )}

      {scannedData && (
        <p className="text-green-700 mt-4 text-sm break-all text-center">
          Scanned Token: {scannedData}
        </p>
      )}
    </div>
  );
};

export default GuardScanner;
