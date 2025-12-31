import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentForm() {
  const [params] = useSearchParams();
  const passType = params.get("type"); // home | local

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    place: "",
    room: "",
    phone: "",
    course: "",
    parentName: "",
    address: "",
  });

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
      parentName: passType === "home" ? "Rajesh Sharma" : "",
      address:
        passType === "home"
          ? "12, Sector 45, Gurgaon, Haryana"
          : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted Data:", { ...formData, passType });

    setSubmitted(true);

    toast.success("Pass request sent to Warden for approval ✅", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
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

            <Input label="Student Name" name="name" value={formData.name} onChange={handleChange} disabled={submitted} />
            <Input label="Enrollment Number" name="enrollment" value={formData.enrollment} onChange={handleChange} disabled={submitted} />
            <Input label="Course" name="course" value={formData.course} onChange={handleChange} disabled={submitted} />
            <Input label="Room Number" name="room" value={formData.room} onChange={handleChange} disabled={submitted} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} disabled={submitted} />
            <Input label="Place Going To" name="place" value={formData.place} onChange={handleChange} disabled={submitted} />

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
