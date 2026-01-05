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
    const q = query(
      collection(db, "SavedData"),
      orderBy("createdAt", "desc")
    );

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
  const filterStudents = (list) =>
    list.filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollment?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredOut = useMemo(
    () => filterStudents(outStudents),
    [outStudents, search]
  );
  const filteredIn = useMemo(
    () => filterStudents(inStudents),
    [inStudents, search]
  );

  /* ---------------- ACTIVE LIST ---------------- */
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
      new Blob([buffer], { type: "application/octet-stream" }),
      `Gate_Log_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-50 p-4">
      <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
        Guard Dashboard
      </h1>

      {/* Counts */}
      <div className="flex justify-center gap-4 mb-4">
        <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-semibold">
          OUT: {filteredOut.length}
        </span>
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
          IN: {filteredIn.length}
        </span>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-4">
        <input
          type="text"
          placeholder="Search by name or enrollment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-4">
        {["OUT", "IN"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}

        <button
          onClick={() => navigate("/guard/scan")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          📷 QR Scan
        </button>
      </div>

      {/* Export */}
      <div className="flex justify-end mb-2">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead
            className={`${
              activeTab === "OUT"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Enrollment</th>
              <th className="p-2">
                {activeTab === "OUT" ? "OUT Time" : "IN Time"}
              </th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((s) => (
              <tr key={s.id} className="text-center border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.enrollment}</td>
                <td className="p-2">
                  {activeTab === "OUT"
                    ? s.outTime?.toDate?.().toLocaleTimeString() || "-"
                    : s.inTime?.toDate?.().toLocaleTimeString() || "-"}
                </td>
                <td className="p-2">
                  {activeTab === "OUT" ? (
                    <button
                      onClick={() => markIn(s)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      ✔ Mark IN
                    </button>
                  ) : (
                    <button
                      onClick={() => moveBackToOut(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      ↩ Move Back
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
