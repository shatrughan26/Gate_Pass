import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function GuardDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("OUT");

  const [outStudents, setOutStudents] = useState([]);
  const [inStudents, setInStudents] = useState([]);

  /* ---------------- PAGINATION ---------------- */
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  /* ---------------- FIRESTORE LISTENER ---------------- */
  useEffect(() => {
    const q = query(collection(db, "SavedData"), orderBy("createdAt", "desc"));

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

  /* ---------------- FILTER ---------------- */
  const filteredOut = useMemo(
    () =>
      outStudents.filter(
        (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.enrollment?.toLowerCase().includes(search.toLowerCase())
      ),
    [outStudents, search]
  );

  const filteredIn = useMemo(
    () =>
      inStudents.filter(
        (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.enrollment?.toLowerCase().includes(search.toLowerCase())
      ),
    [inStudents, search]
  );

  const currentList = activeTab === "OUT" ? filteredOut : filteredIn;
  const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE);

  const paginatedData = currentList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  /* ---------------- ACTIONS ---------------- */
  const markIn = async (student) => {
    await updateDoc(doc(db, "SavedData", student.id), {
      status: "IN",
      inTime: serverTimestamp(),
    });
  };

  const moveBackToOut = async (student) => {
    await updateDoc(doc(db, "SavedData", student.id), {
      status: "OUT",
      inTime: null,
      outTime: serverTimestamp(),
    });
  };

  /* ---------------- EXPORT EXCEL ---------------- */
  const exportExcel = () => {
    const data = currentList.map((s) => ({
      Name: s.name,
      Enrollment: s.enrollment,
      Status: s.status,
      Time:
        s.status === "OUT"
          ? s.outTime?.toDate?.().toLocaleString()
          : s.inTime?.toDate?.().toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gate Log");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Gate_Log_${activeTab}_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Guard Dashboard</h1>

            <button
              onClick={() => navigate("/guard/scan")}
              className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              QR Scan
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            {/* COUNTS */}
            <div className="flex justify-center gap-4 mb-6">
              <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-semibold">
                OUT: {filteredOut.length}
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
                IN: {filteredIn.length}
              </span>
            </div>

            {/* SEARCH */}
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Search by name or enrollment"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* TABS + EXPORT */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div className="flex gap-2">
                {["OUT", "IN"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      activeTab === tab
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Export Excel
              </button>
            </div>

            {/* CARD VIEW */}
            {paginatedData.length === 0 ? (
              <p className="text-center text-gray-500 mt-6">
                No students found
              </p>
            ) : (
              <div
                className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]"
              >
                {paginatedData.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-default
          ${
            activeTab === "OUT"
              ? "bg-red-50 hover:bg-red-100"
              : "bg-green-50 hover:bg-green-100"
          }`}
                  >
                    <h2
                      className={`text-xl font-semibold ${
                        activeTab === "OUT" ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {s.name}
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      Enrollment:{" "}
                      <span className="font-medium">{s.enrollment}</span>
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {activeTab === "OUT" ? "OUT Time:" : "IN Time:"}{" "}
                      <span className="font-medium">
                        {activeTab === "OUT"
                          ? s.outTime?.toDate?.().toLocaleTimeString() || "-"
                          : s.inTime?.toDate?.().toLocaleTimeString() || "-"}
                      </span>
                    </p>

                    <div className="mt-4">
                      {activeTab === "OUT" ? (
                        <button
                          onClick={() => markIn(s)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          ✔ Mark IN
                        </button>
                      ) : (
                        <button
                          onClick={() => moveBackToOut(s)}
                          className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                          ↩ Move Back
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="font-semibold">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
