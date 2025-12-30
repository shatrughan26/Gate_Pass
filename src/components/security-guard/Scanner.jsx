import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";

const GuardScanner = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = (result) => {
    // Prevent multiple scans
    if (hasScanned) return;

    if (result?.[0]?.rawValue) {
      const qrValue = result[0].rawValue;

      setScannedData(qrValue);
      setHasScanned(true);

      // Navigate AFTER short delay (better UX)
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
        {!hasScanned ? (
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
            constraints={{ facingMode: "environment" }}
          />
        ) : (
          <div className="text-green-600 font-semibold text-center">
            QR Scanned Successfully ✔
          </div>
        )}
      </div>

      {!scannedData && (
        <p className="text-gray-500 mt-4 text-center">
          Show the QR code on the student’s phone
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
