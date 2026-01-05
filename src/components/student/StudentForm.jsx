import { useSearchParams, useNavigate, useLocation } from "react-router-dom"; // added useNavigate & useLocation
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentForm() {
  const [params] = useSearchParams();
  const passType = params.get("type"); // home | local

  const navigate = useNavigate(); // initialize navigation
  const location = useLocation();
  const passedState = location.state || {};
  const passedStudentData = passedState.studentData || null;
  const passedEnrollment = passedState.enrollment || "";

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    branch: "",
    place: "",
    room: "",
    phone: "",
    course: "",
    parentName: "",
    address: "",
    travelDate: new Date().toISOString().slice(0,10),
    returnDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    // Try to autofill from navigation state first
    if (passedStudentData) {
      setFormData((prev) => ({
        ...prev,
        name: passedStudentData?.name || prev.name,
        enrollment: passedStudentData?.enrollment || prev.enrollment,
        branch: passedStudentData?.branch || passedStudentData?.course || prev.branch,
        room: passedStudentData?.roomNumber || prev.room,
        phone: passedStudentData?.phoneNumber || prev.phone,
        course: passedStudentData?.course || prev.course,
      }));
      setFetchError("");
      return;
    }

    // Otherwise, if enrollment is present (either via passed state or query param), fetch from Firestore
    const enrollmentFromQuery = params.get("enrollment") || passedEnrollment || "";
    if (!enrollmentFromQuery) return;

    let mounted = true;
    setLoading(true);
    setFetchError("");

    (async () => {
      try {
        const id = enrollmentFromQuery.trim();
        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);

        if (!mounted) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            enrollment: id,
            branch: data.branch || data.course || prev.branch,
            room: data.roomNumber || prev.room,
            phone: data.phoneNumber || prev.phone,
            course: data.course || prev.course,
          }));
          setFetchError("");
        } else {
          setFetchError("Enrollment number not found in database.");
        }
      } catch (err) {
        console.error(err);
        setFetchError("Error fetching student data from database.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [passedStudentData, passedEnrollment, params]);

  const readOnlyAutoFilled = Boolean(passedStudentData || passedEnrollment || formData.name);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ DEMO AUTOFILL
  const fillDemoData = () => {
    setFormData({
      name: "Rohan Sharma",
      enrollment: "ASU2023001",
      course: "B.Tech CSE",
      room: "B-214",
      phone: "9876543210",
      place: "Gurgaon",
      travelDate: new Date().toISOString().slice(0,10),
      returnDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0,10),
      reason: "Visiting home",
      parentName: passType === "home" ? "Rajesh Sharma" : "",
      address: passType === "home" ? "12, Sector 45, Gurgaon, Haryana" : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = { ...formData, passType, submittedAt: new Date().toISOString(), status: "Pending" };

    console.log("Submitted Data:", submissionData);

    // Store data in localStorage (backwards compatibility)
    const pastRequests =
      JSON.parse(localStorage.getItem("studentPasses")) || [];
    localStorage.setItem(
      "studentPasses",
      JSON.stringify([...pastRequests, submissionData])
    );

    // set current student so dashboard can fetch requests
    try {
      if (formData.enrollment) localStorage.setItem("currentStudent", formData.enrollment);
    } catch (e) {
      console.error("Failed to set current student in localStorage", e);
    }

    // Save to Firestore (use enrollment as document id in 'passRequest' collection)
    try {
      if (!submissionData.enrollment) throw new Error("Enrollment missing");
      await setDoc(doc(db, "passRequest", submissionData.enrollment.trim()), submissionData);
    } catch (err) {
      console.error("Failed to save request to Firestore", err);
      toast.error("Failed to submit request to server. Saved locally.");
    }

    setSubmitted(true);

    toast.success("Pass request sent to Warden for approval ✅", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    // Redirect after short delay
    setTimeout(() => {
      navigate("/student/dashboard");
    }, 1500);
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-start p-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              {passType === "home"
                ? "Home Pass Application"
                : "Local Pass Application"}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Fill in the details carefully
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Demo Button */}
            <button
              type="button"
              onClick={fillDemoData}
              disabled={submitted}
              className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-medium disabled:opacity-50"
            >
              Autofill Demo Data
            </button>

            {/* Loading / Fetch Error */}
            {loading && (
              <p className="text-sm text-gray-600">Fetching student data…</p>
            )}
            {fetchError && (
              <p className="text-sm text-red-600">{fetchError}</p>
            )}

            <Input
              label="Student Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={readOnlyAutoFilled || submitted}
            />

            <Input
              label="Enrollment Number"
              name="enrollment"
              value={formData.enrollment}
              onChange={(e) => setFormData({ ...formData, enrollment: e.target.value.toUpperCase() })}
              disabled={readOnlyAutoFilled || submitted}
            />

            <Input
              label="Branch / Course"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={readOnlyAutoFilled || submitted}
            />



            <Input
              label="Room Number"
              name="room"
              value={formData.room}
              onChange={handleChange}
              disabled={true}
            />
            <p className="text-xs text-gray-500 mt-1">Room number is assigned and cannot be changed.</p> 

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={true}
            />
            <p className="text-xs text-gray-500 mt-1">Phone number is taken from records and cannot be edited.</p> 

            <Input
              label="Place Going To"
              name="place"
              value={formData.place}
              onChange={handleChange}
              disabled={submitted}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Date
              </label>
              <input
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                disabled={submitted}
                required
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Date (optional)
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                disabled={submitted}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <Input
              label="Reason / Purpose"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              disabled={submitted}
            />

            {/* Home Pass Extra Fields */}
            {passType === "home" && (
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Parent Details
                </h3>

                <Input
                  label="Parent's Name"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  disabled={submitted}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={submitted}
                    required
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitted}
              className={`w-full py-3 rounded-lg font-semibold transition shadow-md
                ${
                  submitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }`}
            >
              {submitted ? "Submitted" : "Submit for Approval"}
            </button>

            {/* Dashboard Shortcut */}
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              className="w-full mt-2 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700"
            >
              Go to Student Dashboard
            </button>

            {/* Success Message */}
            {submitted && (
              <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 text-center">
                ✅ Your request has been successfully sent to the Warden.
                <br />
                Please wait for approval.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

/* Reusable Input Component */
function Input({ label, name, value, onChange, disabled }) {
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
        disabled={disabled}
        required
        className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
      />
    </div>
  );
}
