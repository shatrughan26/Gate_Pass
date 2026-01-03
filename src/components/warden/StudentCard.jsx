import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function StudentCard() {
  const { enrollment } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageDB = JSON.parse(localStorage.getItem("studentImages")) || {};

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const ref = doc(db, "students", enrollment);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setStudent({ enrollment, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 DELETE STUDENT */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "students", enrollment));
      alert("Student deleted successfully");
      navigate("/warden-dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
    }
  };

  /* 🔹 EDIT STUDENT */
  const handleEdit = () => {
    navigate(`/edit-student/${enrollment}`);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!student) {
    return <p className="text-center mt-10">Student not found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* IMAGE */}
          <div className="w-40 h-52 rounded-xl overflow-hidden bg-gray-100 border">
            {imageDB[enrollment] ? (
              <img
                src={imageDB[enrollment]}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-blue-800">{student.name}</h2>

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
              <b>Father Name:</b> {student.fatherName}
            </p>
            <p>
              <b>Address:</b> {student.address}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-6 mt-6">
              <button
                onClick={handleEdit}
                className="text-blue-600 font-semibold hover:underline"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
