// src/components/warden/WardenDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function WardenDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Image DB (localStorage)
  const [imageDB, setImageDB] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentImages")) || {};
    } catch {
      return {};
    }
  });

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

  // IMAGE UPLOAD
  const handleImageUpload = (e, enrollment) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...imageDB, [enrollment]: reader.result };
      setImageDB(updated);
      localStorage.setItem("studentImages", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  // DELETE
  const handleDelete = async (enrollment) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await deleteDoc(doc(db, "students", enrollment));

      const updatedImages = { ...imageDB };
      delete updatedImages[enrollment];
      setImageDB(updatedImages);
      localStorage.setItem("studentImages", JSON.stringify(updatedImages));

      setStudents((prev) => prev.filter((s) => s.enrollment !== enrollment));
    } catch (err) {
      console.error(err);
    }
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

            {/* STUDENTS */}
            {loading ? (
              <p className="text-center text-gray-500">Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500">No students found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                  <div
                    key={student.enrollment}
                    className="bg-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center"
                  >
                    {/* LEFT: DETAILS */}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-800 mb-2">
                        {student.name}
                      </h2>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <b>Enrollment:</b> {student.enrollment}
                        </p>
                        <p>
                          <b>Room:</b> {student.roomNumber}
                        </p>
                        <p>
                          <b>Phone:</b> {student.phoneNumber}
                        </p>
                        <p>
                          <b>Father:</b> {student.fatherName}
                        </p>
                        <p>
                          <b>Address:</b> {student.address}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-3 flex gap-4 text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/edit-student/${student.enrollment}`)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.enrollment)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* RIGHT: IMAGE UPLOAD */}
                    <div className="flex flex-col items-center ml-4">
                      <label
                        htmlFor={`img-${student.enrollment}`}
                        className="w-28 h-36 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-80 transition border border-gray-300 shadow-sm"
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
