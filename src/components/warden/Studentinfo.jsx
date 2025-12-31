// src/components/warden/WardenDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentInfo() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "",
    enrollment: "",
    address: "",
    roomNumber: "",
    fatherName: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = () => {
    const { name, enrollment, address, roomNumber, fatherName, phoneNumber } = studentData;

    if (name && enrollment && address && roomNumber && fatherName && phoneNumber) {
      // Placeholder for backend API call
      console.log("Student added:", studentData);

      // Reset form
      setStudentData({
        name: "",
        enrollment: "",
        address: "",
        roomNumber: "",
        fatherName: "",
        phoneNumber: "",
      });
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg mt-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Add Student Details</h1>

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="enrollment"
          placeholder="Enrollment Number"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.enrollment}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.roomNumber}
          onChange={handleChange}
        />

        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.fatherName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.phoneNumber}
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={handleAddStudent}
        >
          Add Student
        </button>

        <button
          className="w-full mt-4 text-blue-600 hover:underline"
          onClick={() => navigate("/warden-portal")}
        >
          Go to Manage Students Portal
        </button>
      </div>
    </div>
  );
}
