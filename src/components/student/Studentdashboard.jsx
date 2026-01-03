import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentDashboard() {
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
    // Subscribe to 'passRequest' doc for current logged-in student (if available)
    const current = localStorage.getItem("currentStudent");
    if (!current) {
      // fallback: read localStorage-stored passes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestPass = studentPasses[0];

  const handleImageUpload = (e) => {
    if (!latestPass) return; // guard against no pass

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
    setEditingDate(currentDate || new Date().toISOString().slice(0,10));
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

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px] flex flex-col md:flex-row gap-6">
        {/* Left: Info */}
        <div className="flex-1">
          {/* Home Tab */}
          {activeTab === "home" && latestPass && (
            <div>
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                Latest Pass Details
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>Name:</strong> {latestPass.name}
                </li>
                <li>
                  <strong>Enrollment:</strong> {latestPass.enrollment}
                </li>
                <li>
                  <strong>Course:</strong> {latestPass.course}
                </li>
                <li>
                  <strong>Room:</strong> {latestPass.room}
                </li>
                <li>
                  <strong>Phone:</strong> {latestPass.phone}
                </li>
                <li>
                  <strong>Place:</strong> {latestPass.place}
                </li>
                <li>
                  <strong>Travel Date:</strong> {latestPass.travelDate ? new Date(latestPass.travelDate).toLocaleDateString() : "-"}
                </li>
                {latestPass.passType === "home" && (
                  <>
                    <li>
                      <strong>Parent Name:</strong> {latestPass.parentName}
                    </li>
                    <li>
                      <strong>Address:</strong> {latestPass.address}
                    </li>
                  </>
                )}
                <li>
                  <strong>Pass Type:</strong>{" "}
                  {latestPass.passType.toUpperCase()}
                </li>
                <li>
                  <strong>Submitted At:</strong>{" "}
                  {new Date(latestPass.submittedAt).toLocaleString()}
                </li>
                <li>
                  <strong>Status:</strong>{" "}
                  {latestPass.status || "Pending"}
                </li>
                {latestPass.approvedAt && (
                  <li>
                    <strong>Approved At:</strong>{" "}
                    {new Date(latestPass.approvedAt).toLocaleString()}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* QR Tab */}
          {activeTab === "qr" && latestPass && latestPass.status === "Approved" && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                QR Code Approved by Warden
              </h2>
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <QRCode value={`PASS-${latestPass.enrollment}`} size={160} />
              </div>
              <p className="text-gray-600 text-center">
                Show this QR code to Warden/security for verification.
              </p>
            </div>
          )}

          {activeTab === "qr" &&
            latestPass &&
            latestPass.status !== "Approved" && (
              <p className="text-gray-600 text-center mt-4">
                QR Code will be available once Warden approves your pass.
              </p>
            )}

          {/* Past Requests Tab */}
          {activeTab === "past" && (
            <div>
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                Past Pass Requests
              </h2>
              <p className="text-sm text-gray-500 mb-3">You can edit the travel date for Pending requests by clicking "Edit".</p>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-indigo-100 text-indigo-700">
                      <th className="border px-4 py-2">Submission Time</th>
                      <th className="border px-4 py-2">Travel Date</th>
                      <th className="border px-4 py-2">Approval Time</th>
                      <th className="border px-4 py-2">Pass Type</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPasses.map((req, idx) => (
                      <tr
                        key={idx}
                        className={`text-center ${
                          req.status === "Approved"
                            ? "bg-green-50"
                            : req.status === "Rejected"
                            ? "bg-red-50"
                            : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="border px-4 py-2">
                          {new Date(req.submittedAt).toLocaleString()}
                        </td>
                        <td className="border px-4 py-2">
                          {editingIndex === idx ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="date"
                                value={editingDate}
                                onChange={(e) => setEditingDate(e.target.value)}
                                className="border px-2 py-1 rounded"
                              />
                              <button
                                onClick={() => saveEdit(idx)}
                                className="text-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => cancelEdit()}
                                className="text-red-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div>
                              {req.travelDate ? new Date(req.travelDate).toLocaleDateString() : "-"}
                              {(!req.status || req.status === "Pending") && (
                                <div>
                                  <button
                                    onClick={() => startEdit(idx, req.travelDate)}
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {req.approvedAt
                            ? new Date(req.approvedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="border px-4 py-2">{req.passType}</td>
                        <td
                          className={`border px-4 py-2 font-semibold ${
                            req.status === "Approved"
                              ? "text-green-600"
                              : req.status === "Rejected"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {req.status || "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Profile Image Upload */}
        {latestPass && (
          <div className="w-full md:w-64 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
              Profile Image
            </h2>
            <div
              className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              onClick={handleImageClick}
            >
              {studentImage ? (
                <img
                  src={studentImage}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Click to upload</span>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-gray-500 text-center mt-2 text-xs">
              Click image to upload or update. Saved forever.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
