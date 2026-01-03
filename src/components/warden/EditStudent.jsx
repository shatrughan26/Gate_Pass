// src/components/warden/EditStudent.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditStudent() {
  const { enrollment } = useParams();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    name: "",
    roomNumber: "",
    fatherName: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "students", enrollment);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
  }, [enrollment]);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  setLoading(true);
  try {
    await updateDoc(doc(db, "students", enrollment), studentData);

    toast.success("Student updated successfully ✅", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      navigate("/warden-dashboard");
    }, 1500);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update student ❌", {
      position: "top-right",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-6">
      <ToastContainer />
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl mt-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center rounded-t-2xl">
          <h1 className="text-2xl font-bold text-white">Edit Student Details</h1>
          <p className="text-blue-100 text-sm mt-1">
            Update student information carefully
          </p>
        </div>

        <div className="p-8 space-y-5">
          {["name", "roomNumber", "fatherName", "phoneNumber"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "roomNumber"
                  ? "Room Number"
                  : field === "fatherName"
                  ? "Father's Name"
                  : field === "phoneNumber"
                  ? "Phone Number"
                  : "Student Name"}
              </label>
              <input
                type="text"
                name={field}
                value={studentData[field]}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

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
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition ${
                loading ? "cursor-not-allowed bg-gray-400" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => navigate("/warden-dashboard")}
              className="w-full text-blue-600 hover:underline text-sm"
            >
              ← Back to Warden Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
