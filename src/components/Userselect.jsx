import { useNavigate } from "react-router-dom";

export default function UserSelect() {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const role = e.target.value;

    if (role === "student") navigate("/student/login");
    if (role === "warden") navigate("/login");
    if (role === "guard") navigate("/guard/login");
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Select User Type</h2>

        <select onChange={handleChange} defaultValue="">
          <option value="" disabled>
            -- Choose Role --
          </option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
          <option value="guard">Guard</option>
        </select>
      </div>
    </div>
  );
}
