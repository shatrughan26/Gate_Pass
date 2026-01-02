import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import asuLogo from "../../assets/asu-logo.png";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!enrollment) {
      setError("Please enter enrollment number");
      return;
    }

    try {
      const docRef = doc(db, "students", enrollment.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStudentData(docSnap.data()); // fetched data
        setIsLoggedIn(true);
      } else {
        setError("Enrollment number not found");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data");
    }
  };

  const handlePassSelect = (type) => {
    // pass both enrollment and studentData so StudentForm can autofill
    navigate(`/student/form?type=${type}`, {
      state: { studentData, enrollment },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          <div className="mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-2"
              aria-label="Go back"
            >
              ← Back
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={asuLogo}
              alt="Apeejay Stya University Logo"
              className="w-24 h-24 object-contain rounded-full shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Apeejay Stya University
            </h1>
            <h2 className="text-lg text-gray-600 mt-1">
              Hostel & Home Pass
            </h2>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* FETCH PHASE */}
          {!isLoggedIn && (
            <form onSubmit={handleLogin}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Number
              </label>

              <input
                type="text"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter enrollment number"
              />

              {error && (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md"
              >
                Fetch Student Data
              </button>
            </form>
          )}

          {/* PASS TYPE PHASE */}
          {isLoggedIn && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-2">
                Welcome, {studentData?.name}
              </h3>

              <button
                onClick={() => handlePassSelect("local")}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Local Pass
              </button>

              <button
                onClick={() => handlePassSelect("home")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Home Pass
              </button>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/student-dashboard")}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Student Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
