import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, serverTimestamp } from "../../firebase/firebase";

export default function GuardDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("OUT");
  const [outStudents, setOutStudents] = useState([]);
  const [inStudents, setInStudents] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "SavedData"),
      orderBy("createdAt", "desc")
    );

    // 🔥 Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const out = [];
      const inside = [];

      snapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (data.status === "OUT") out.push(data);
        if (data.status === "IN") inside.push(data);
      });

      setOutStudents(out);
      setInStudents(inside);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Mark student IN
  const markIn = async (student) => {
    const ref = doc(db, "SavedData", student.id);

    await updateDoc(ref, {
      status: "IN",
      inTime: serverTimestamp(),
    });
  };

  // 🔁 Mistouch correction → move back to OUT
  const moveBackToOut = async (student) => {
    const ref = doc(db, "SavedData", student.id);

    await updateDoc(ref, {
      status: "OUT",
      inTime: null,
      outTime: serverTimestamp(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Guard Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("OUT")}
          className={`px-6 py-2 rounded ${
            activeTab === "OUT"
              ? "bg-red-600 text-white"
              : "bg-white border"
          }`}
        >
          OUT Students
        </button>

        <button
          onClick={() => setActiveTab("IN")}
          className={`px-6 py-2 rounded ${
            activeTab === "IN"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          IN Students
        </button>

        <button
          onClick={() => navigate("/guard/scan")}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          📷 QR Scanner
        </button>
      </div>

      {/* OUT TABLE */}
      {activeTab === "OUT" && (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Enrollment</th>
                <th className="p-2">Date</th>
                <th className="p-2">OUT Time</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {outStudents.map((s) => (
                <tr key={s.id} className="text-center border-t">
                  <td>{s.name}</td>
                  <td>{s.enrollment}</td>
                  <td>{s.date}</td>
                  <td>
                    {s.outTime?.toDate
                      ? s.outTime.toDate().toLocaleTimeString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => markIn(s)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      ✔ Mark IN
                    </button>
                  </td>
                </tr>
              ))}

              {outStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No students outside
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* IN TABLE */}
      {activeTab === "IN" && (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Enrollment</th>
                <th className="p-2">IN Time</th>
                <th className="p-2">Correction</th>
              </tr>
            </thead>
            <tbody>
              {inStudents.map((s) => (
                <tr key={s.id} className="text-center border-t">
                  <td>{s.name}</td>
                  <td>{s.enrollment}</td>
                  <td>
                    {s.inTime?.toDate
                      ? s.inTime.toDate().toLocaleTimeString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => moveBackToOut(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      ↩ Move Back
                    </button>
                  </td>
                </tr>
              ))}

              {inStudents.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No students inside
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
