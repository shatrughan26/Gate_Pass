// src/components/warden/WardenDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // adjust path
import { collection, getDocs } from "firebase/firestore";

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentList = querySnapshot.docs.map((doc) => ({
          enrollment: doc.id, // enrollment as document ID
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

  // Filter students by enrollment number
  const filteredStudents =
    search === ""
      ? students
      : students.filter((s) =>
          s.enrollment.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Warden Dashboard</h1>

          {/* Add Student Button */}
          <button
            onClick={() => navigate("/student-info")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Add Student
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by Enrollment Number"
            className="w-full max-w-md border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <p className="text-center text-gray-500">Loading students...</p>
        ) : (
          // Student Cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No students found.
              </p>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.enrollment}
                  className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
                >
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    {student.name}
                  </h2>
                  <p className="text-gray-700">
                    <span className="font-semibold">Enrollment:</span>{" "}
                    {student.enrollment}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Address:</span>{" "}
                    {student.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Room Number:</span>{" "}
                    {student.roomNumber}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Father's Name:</span>{" "}
                    {student.fatherName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {student.phoneNumber}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
