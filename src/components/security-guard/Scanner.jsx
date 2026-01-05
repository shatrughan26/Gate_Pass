import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuardScanner = () => {
  const navigate = useNavigate();

  const [hasScanned, setHasScanned] = useState(false);
  const [startScan, setStartScan] = useState(false);

  const handleScan = async (result) => {
    if (hasScanned) return;

    const enrollment = result?.[0]?.rawValue;
    if (!enrollment) return;

    try {
      // 🔍 Fetch student using enrollment
      const q = query(
        collection(db, "SavedData"),
        where("enrollment", "==", enrollment)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("Invalid QR ❌ Student not found");
        return;
      }

      const docSnap = snapshot.docs[0];
      const studentRef = docSnap.ref;

      // 🕒 Mark OUT
      await updateDoc(studentRef, {
        status: "OUT",
        outTime: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      });

      if (navigator.vibrate) navigator.vibrate(200);

      setHasScanned(true);
      setStartScan(false);

      toast.success("Student marked OUT ✅");

      setTimeout(() => {
        navigate("/guard/dashboard");
      }, 800);

    } catch (error) {
      console.error(error);
      toast.error("Scan failed ❌");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold mb-6">Scan Student QR</h2>

        <div className="w-full max-w-xs h-64 bg-white rounded-xl shadow-lg flex items-center justify-center">
          {!startScan && !hasScanned && (
            <button
              onClick={() => setStartScan(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Scan QR
            </button>
          )}

          {startScan && !hasScanned && (
            <Scanner
              onScan={handleScan}
              constraints={{ facingMode: "environment" }}
            />
          )}

          {hasScanned && (
            <div className="text-green-600 font-semibold">
              ✔ Scan Complete
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GuardScanner;
