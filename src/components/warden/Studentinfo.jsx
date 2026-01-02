// src/components/warden/StudentInfo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
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
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

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
      await setDoc(doc(db, "students", enrollment), studentData);
      setMessage({ text: "Student added successfully ✅", type: "success" });

      setStudentData({
        name: "",
        enrollment: "",
        address: "",
        roomNumber: "",
        fatherName: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Failed to add student. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl mt-8">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center rounded-t-2xl">
          <h1 className="text-2xl font-bold text-white">Add Student Details</h1>
          <p className="text-blue-100 text-sm mt-1">
            Enter student information carefully
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAddStudent} className="p-8 space-y-5">

          {message.text && (
            <div
              className={`p-3 rounded-lg text-center font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "bg-red-50 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <Input label="Student Name" name="name" value={studentData.name} onChange={handleChange} />
          <Input label="Enrollment Number" name="enrollment" value={studentData.enrollment} onChange={handleChange} />
          <Input label="Room Number" name="roomNumber" value={studentData.roomNumber} onChange={handleChange} />
          <Input label="Father's Name" name="fatherName" value={studentData.fatherName} onChange={handleChange} />
          <Input label="Phone Number" name="phoneNumber" value={studentData.phoneNumber} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows="3"
              value={studentData.address}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              }`}
          >
            {loading ? "Adding Student..." : "Add Student"}
          </button>

          {/* ✅ FIXED BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/warden-dashboard")}
            className="w-full text-blue-600 hover:underline text-sm"
          >
            ← Back to Warden Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
