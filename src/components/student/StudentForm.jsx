import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function StudentForm() {
  const [params] = useSearchParams();
  const passType = params.get("type"); // home | local

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, passType });
    alert("Pass request sent to Warden for approval");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          {passType === "home" ? "Home Pass" : "Local Pass"} Details
        </h2>

        <input name="name" placeholder="Student Name" onChange={handleChange} required className="input" />
        <input name="enrollment" placeholder="Enrollment Number" onChange={handleChange} required className="input" />
        <input name="place" placeholder="Place Going To" onChange={handleChange} required className="input" />
        <input name="room" placeholder="Room Number" onChange={handleChange} required className="input" />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required className="input" />
        <input name="course" placeholder="Course" onChange={handleChange} required className="input" />

        {passType === "home" && (
          <>
            <input name="parentName" placeholder="Parent's Name" onChange={handleChange} required className="input" />
            <textarea name="address" placeholder="Home Address" onChange={handleChange} required className="input" />
          </>
        )}

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Submit for Approval
        </button>
      </form>
    </div>
  );
}
