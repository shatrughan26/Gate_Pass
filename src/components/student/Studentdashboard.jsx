import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [studentPasses, setStudentPasses] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);

  /* ================= CURRENT REQUEST ================= */
  useEffect(() => {
    const enrollment = localStorage.getItem("currentStudent");
    if (!enrollment) return;

    const unsub = onSnapshot(doc(db, "passRequest", enrollment), (snap) => {
      if (snap.exists()) {
        setStudentPasses([{ id: snap.id, ...snap.data() }]);
      } else {
        setStudentPasses([]);
      }
    });

    return () => unsub();
  }, []);

  const latestPass = studentPasses[0];

  /* ================= PAST REQUESTS ================= */
  useEffect(() => {
    const enrollment = localStorage.getItem("currentStudent");
    if (!enrollment) return;

    const q = query(
  collection(db, "SavedData"),
  where("enrollment", "==", enrollment)
);


    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPastRequests(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Back */}
      <button
        onClick={() => navigate("/student/login")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Student Login
      </button>

      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Student Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {["home", "qr", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500"
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

      {/* Content Box */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        {/* ================= HOME TAB ================= */}
        {activeTab === "home" && (
          <>
            {latestPass ? (
              <div className="space-y-2 text-gray-700">
                <p><strong>Name:</strong> {latestPass.name}</p>
                <p><strong>Enrollment:</strong> {latestPass.enrollment}</p>
                <p><strong>Course:</strong> {latestPass.course}</p>
                <p><strong>Room:</strong> {latestPass.room}</p>
                <p><strong>Phone:</strong> {latestPass.phone}</p>
                <p><strong>Place:</strong> {latestPass.place}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      latestPass.status === "Approved"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {latestPass.status || "Pending"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No active request found</p>
            )}
          </>
        )}

        {/* ================= QR TAB ================= */}
        {/* ================= QR TAB ================= */}
{activeTab === "qr" && (
  <>
    {!latestPass && (
      <p className="text-gray-500 text-center">
        No active request found
      </p>
    )}

    {latestPass && latestPass.status !== "Approved" && (
      <div className="text-center text-blue-600 font-medium">
        QR will be generated only after warden approval
      </div>
    )}

    {latestPass && latestPass.status === "Approved" && (
      <div className="flex flex-col items-center gap-4">
        <QRCode
          value={`PASS-${latestPass.enrollment}`}
          size={180}
        />
        <p className="text-sm text-gray-500">
          Show this QR at the hostel gate
        </p>
      </div>
    )}
  </>
)}


        {/* ================= PAST REQUESTS TAB ================= */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastRequests.length === 0 ? (
              <p className="text-gray-500">No past requests found</p>
            ) : (
              pastRequests.map((req) => (
                <div
                  key={req.id}
                  className="border rounded-lg p-4 bg-blue-50"
                >
                  <p><strong>Name:</strong> {req.name}</p>
                  <p><strong>Enrollment:</strong> {req.enrollment}</p>
                  <p><strong>Course:</strong> {req.course}</p>
                  <p><strong>Status:</strong> {req.status}</p>

                  {req.outTime && (
                    <p>
                      <strong>Out Time:</strong>{" "}
                      {req.outTime.toDate().toLocaleString()}
                    </p>
                  )}

                  {req.inTime && (
                    <p>
                      <strong>In Time:</strong>{" "}
                      {req.inTime.toDate().toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
