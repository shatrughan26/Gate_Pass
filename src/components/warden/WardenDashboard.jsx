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

  // 🔹 Image DB (same logic as StudentDashboard)
  const [imageDB, setImageDB] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentImages")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentList = querySnapshot.docs.map((doc) => ({
          enrollment: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 🔹 Upload handler
  const handleImageUpload = (e, enrollment) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedDB = {
        ...imageDB,
        [enrollment]: reader.result,
      };
      setImageDB(updatedDB);
      localStorage.setItem("studentImages", JSON.stringify(updatedDB));
    };
    reader.readAsDataURL(file);
  };

  const filteredStudents =
    search === ""
      ? students
      : students.filter((s) =>
          s.enrollment.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Warden Dashboard
            </h1>

            <button
              onClick={() => navigate("/student-info")}
              className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              + Add Student
            </button>
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
                className="w-full max-w-md border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* LOADING */}
            {loading ? (
              <p className="text-center text-gray-500">Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500">No students found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                  <div
                    key={student.enrollment}
                    className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center"
                  >
                    {/* LEFT: DETAILS */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-800 mb-2">
                        {student.name}
                      </h2>

                      <div className="space-y-1 text-gray-700 text-sm">
                        <p>
                          <span className="font-semibold">Enrollment:</span>{" "}
                          {student.enrollment}
                        </p>
                        <p>
                          <span className="font-semibold">Room:</span>{" "}
                          {student.roomNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {student.phoneNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Father:</span>{" "}
                          {student.fatherName}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {student.address}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: IMAGE UPLOAD */}
                    <div className="flex flex-col items-center ml-4">
                      <label
                        htmlFor={`img-${student.enrollment}`}
                        className="w-28 h-36 rounded-xl overflow-hidden bg-gray-100
             flex items-center justify-center cursor-pointer
             hover:opacity-80 transition border border-gray-300 shadow-sm"
                      >
                        {imageDB[student.enrollment] ? (
                          <img
                            src={imageDB[student.enrollment]}
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs text-center px-2">
                            Click to upload
                          </span>
                        )}
                      </label>

                      <input
                        id={`img-${student.enrollment}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, student.enrollment)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
