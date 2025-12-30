// src/components/warden/WardenDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEnrollment, setStudentEnrollment] = useState("");

  const handleAddStudent = () => {
    if (studentName && studentEnrollment) {
      setStudents([...students, { name: studentName, enrollment: studentEnrollment }]);
      setStudentName("");
      setStudentEnrollment("");
    }
  };

  const handleDeleteStudent = (enrollment) => {
    setStudents(students.filter((s) => s.enrollment !== enrollment));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warden Dashboard</h1>
        <button
          onClick={() => navigate("/warden-portal")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Manage Students
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Student</h2>
        <input
          type="text"
          placeholder="Student Name"
          className="border p-2 rounded mr-2"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enrollment Number"
          className="border p-2 rounded mr-2"
          value={studentEnrollment}
          onChange={(e) => setStudentEnrollment(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddStudent}
        >
          Add
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Enrollment</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollment}>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.enrollment}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteStudent(student.enrollment)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
