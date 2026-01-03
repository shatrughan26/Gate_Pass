// src/components/warden/StudentInfo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // adjust path
import { doc, setDoc } from "firebase/firestore";

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: success/error

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    const { name, enrollment, address, roomNumber, fatherName, phoneNumber } =
      studentData;

    if (
      !name ||
      !enrollment ||
      !address ||
      !roomNumber ||
      !fatherName ||
      !phoneNumber
    ) {
      setMessage({ text: "Please fill all fields!", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Save student in Firestore using enrollment as document ID
      await setDoc(doc(db, "students", enrollment), studentData);
      setMessage({ text: "Student added successfully!", type: "success" });

      // Reset form
      setStudentData({
        name: "",
        enrollment: "",
        address: "",
        roomNumber: "",
        fatherName: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage({
        text: "Failed to add student. Check console for details.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-start p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg mt-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Add Student Details
        </h1>

        {message.text && (
          <p
            className={`mb-4 text-center font-semibold ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

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
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={studentData.phoneNumber}
          onChange={handleChange}
        />

        <button
          className={`w-full py-3 rounded-lg text-white ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
          onClick={handleAddStudent}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>

        <button
          className="w-full mt-4 text-blue-600 hover:underline"
          onClick={() => navigate("/warden-dashboard")}
        >
          Go to Warden Dashboard
        </button>
      </div>
    </div>
  );
}

// add student deatils page is this one