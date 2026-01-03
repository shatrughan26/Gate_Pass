import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUserShield, FaUserLock } from "react-icons/fa"; // Icons for student, warden, guard

export default function UserSelect() {
  const navigate = useNavigate();

  const roles = [
    {
      name: "Student",
      value: "student",
      color: "bg-green-400",
      icon: <FaUserGraduate className="text-4xl text-white mb-2" />,
      path: "/student/login",
    },
    {
      name: "Warden",
      value: "warden",
      color: "bg-yellow-400",
      icon: <FaUserShield className="text-4xl text-white mb-2" />,
      path: "/login",
    },
    {
      name: "Guard",
      value: "guard",
      color: "bg-purple-500",
      icon: <FaUserLock className="text-4xl text-white mb-2" />,
      path: "/guard/login",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-10">Select User Type</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {roles.map((role) => (
            <div
              key={role.value}
              onClick={() => navigate(role.path)}
              className={`cursor-pointer ${role.color} rounded-xl shadow-lg w-48 h-48 flex flex-col items-center justify-center transform transition hover:scale-105 hover:shadow-2xl`}
            >
              {role.icon}
              <span className="text-white text-xl font-semibold">{role.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
