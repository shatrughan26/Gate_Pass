import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [studentPasses, setStudentPasses] = useState([]);
  const [imageDB, setImageDB] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentImages")) || {};
    } catch {
      return {};
    }
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingDate, setEditingDate] = useState("");

  useEffect(() => {
    const current = localStorage.getItem("currentStudent");
    if (!current) {
      try {
        const local = JSON.parse(localStorage.getItem("studentPasses")) || [];
        setStudentPasses(local);
      } catch {
        setStudentPasses([]);
      }
      return;
    }

    const unsub = onSnapshot(doc(db, "passRequest", current), (snap) => {
      if (!snap.exists()) {
        setStudentPasses([]);
      } else {
        setStudentPasses([{ id: snap.id, ...snap.data() }]);
      }
    });

    return () => unsub();
  }, []);

  const latestPass = studentPasses[0];

  const handleImageUpload = (e) => {
    if (!latestPass) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const updatedDB = { ...imageDB, [latestPass.enrollment]: base64 };
      setImageDB(updatedDB);
      localStorage.setItem("studentImages", JSON.stringify(updatedDB));
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const studentImage =
    (latestPass && imageDB[latestPass.enrollment]) || selectedImage;

  const startEdit = (idx, currentDate) => {
    setEditingIndex(idx);
    setEditingDate(currentDate || new Date().toISOString().slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingDate("");
  };

  const saveEdit = (idx) => {
    const updated = [...studentPasses];
    updated[idx] = { ...updated[idx], travelDate: editingDate };
    localStorage.setItem("studentPasses", JSON.stringify(updated));
    setStudentPasses(updated);
    cancelEdit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/student/login")}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Back to Student Login
      </button>

      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
        Welcome, Student!
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {["home", "qr", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition ${
              activeTab === tab
                ? "bg-white shadow-md text-indigo-700"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            {tab === "home"
              ? "Home"
              : tab === "qr"
              ? "QR Code"
              : "Past Requests"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px] flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {activeTab === "home" && latestPass && (
            <ul className="space-y-2 text-gray-700">
              <li><strong>Name:</strong> {latestPass.name}</li>
              <li><strong>Enrollment:</strong> {latestPass.enrollment}</li>
              <li><strong>Course:</strong> {latestPass.course}</li>
              <li><strong>Room:</strong> {latestPass.room}</li>
              <li><strong>Phone:</strong> {latestPass.phone}</li>
              <li><strong>Place:</strong> {latestPass.place}</li>
              <li><strong>Travel Date:</strong> {latestPass.travelDate ? new Date(latestPass.travelDate).toLocaleDateString() : "-"}</li>
              <li><strong>Status:</strong> {latestPass.status || "Pending"}</li>
            </ul>
          )}

          {activeTab === "qr" && latestPass?.status === "Approved" && (
            <div className="flex flex-col items-center">
              <QRCode value={`PASS-${latestPass.enrollment}`} size={160} />
            </div>
          )}

          {activeTab === "past" && (
            <p className="text-gray-500">Past requests shown here.</p>
          )}
        </div>

        {latestPass && (
          <div className="w-full md:w-64 flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
              onClick={handleImageClick}
            >
              {studentImage ? (
                <img src={studentImage} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 flex items-center justify-center h-full">
                  Click to upload
                </span>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
