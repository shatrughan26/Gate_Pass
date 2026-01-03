// src/components/warden/WardenDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function WardenDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const STUDENTS_PER_PAGE = 50;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const list = snapshot.docs.map((doc) => ({
        enrollment: doc.id,
        ...doc.data(),
      }));
      setStudents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter students
  const filteredStudents =
    search === ""
      ? students
      : students.filter((s) =>
          s.enrollment.toLowerCase().includes(search.toLowerCase())
        );

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + STUDENTS_PER_PAGE
  );

  // 🔹 Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Warden Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/student-info")}
                className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                + Add Student
              </button>

              <button
                onClick={() => navigate("/warden/requests")}
                className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                See Requests
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            {/* SEARCH */}
            <div className="mb-6 flex justify-center">
              <input
                type="text"
                placeholder="Search by Enrollment Number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* STUDENT LIST */}
            {loading ? (
              <p className="text-center text-gray-500">Loading students...</p>
            ) : currentStudents.length === 0 ? (
              <p className="text-center text-gray-500">No students found.</p>
            ) : (
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                {currentStudents.map((student) => (
                  <div
                    key={student.enrollment}
                    onClick={() =>
                      navigate(`/student-details/${student.enrollment}`)
                    }
                    className="cursor-pointer bg-blue-50 rounded-xl p-6 shadow-sm hover:shadow-lg hover:bg-blue-100 transition"
                  >
                    <h2 className="text-xl font-semibold text-blue-800">
                      {student.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Enrollment: {student.enrollment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 🔹 BOTTOM PAGINATION CONTROLS */}
            {totalPages > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-2 text-sm ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:underline"
                  }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white font-semibold"
                          : "text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-2 text-sm ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:underline"
                  }`}
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
