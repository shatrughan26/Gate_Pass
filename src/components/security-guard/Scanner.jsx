import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuardScanner = () => {
  const navigate = useNavigate();

  const [hasScanned, setHasScanned] = useState(false);
  const [startScan, setStartScan] = useState(false);

  const handleScan = async (result) => {
    if (hasScanned) return;

    const rawValue = result?.[0]?.rawValue; // PASS-ASU2023010100063
    if (!rawValue) return;

    const enrollment = rawValue.replace("PASS-", "").trim();

    console.log("RAW QR:", rawValue);
    console.log("MATCHING ENROLLMENT:", enrollment);

    try {
      // 🔹 1. VERIFY STUDENT
      const studentRef = doc(db, "students", enrollment);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        toast.error("Invalid QR ❌ Student not found");
        return;
      }

      const studentData = studentSnap.data();

      // 🔹 2. SAVE MOVEMENT (CORRECT STRUCTURE)
      await addDoc(collection(db, "SavedData"), {
        enrollment,
        name: studentData.name,
        course: studentData.course || "",

        status: "OUT",
        outTime: serverTimestamp(),
        inTime: null,
        createdAt: serverTimestamp(),
      });

      // 🔹 3. UPDATE CURRENT STATUS
      await updateDoc(studentRef, {
        status: "OUT",
        lastOutTime: serverTimestamp(),
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
      <ToastContainer position="top-center" autoClose={2000} />

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
