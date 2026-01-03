import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentRequest({ readOnly = false }) {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [expanded, setExpanded] = useState({});

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Action state
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState("");

  // Confirmation modal
  const [confirmBox, setConfirmBox] = useState({
    open: false,
    id: null,
    status: "",
  });

  useEffect(() => {
    const q = query(collection(db, "passRequest"), orderBy("submittedAt", "desc"));

    const unsub = onSnapshot(q, async (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const enrollments = [...new Set(docs.map((r) => r.enrollment))];
      const studentMap = {};

      await Promise.all(
        enrollments.map(async (enr) => {
          const sDoc = await getDoc(doc(db, "students", enr));
          studentMap[enr] = sDoc.exists() ? sDoc.data() : null;
        })
      );

      setRequests(docs.map((r) => ({ ...r, student: studentMap[r.enrollment] })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Filtering
  const filtered = requests.filter((r) => {
    const matchSearch =
      r.enrollment?.toLowerCase().includes(search.toLowerCase()) ||
      r.student?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.passType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => setPage(1), [search, statusFilter, typeFilter]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const updateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      setActionType(status);

      const user = auth.currentUser;

      await updateDoc(doc(db, "passRequest", id), {
        status,
        remark: remarks[id] || "",
        approvedAt: new Date().toISOString(),
        approvedBy: user?.uid || null,
        approverEmail: user?.email || null,
      });

      toast.success(`Request ${status}`);
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoadingId(null);
      setActionType("");
      setConfirmBox({ open: false, id: null, status: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <ToastContainer position="bottom-center" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Student Pass Requests</h1>
        </div>

        {/* BACK BUTTON */}
        <div className="p-6">
          <p
            onClick={() => navigate("/warden-dashboard")}
            className="mb-4 text-blue-600 cursor-pointer hover:underline"
          >
            ← Back to Dashboard
          </p>
        </div>

        {/* FILTERS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Search name or enrollment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="home">Home</option>
            <option value="local">Local</option>
          </select>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="border px-4 py-2 text-left">Student</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {current.map((r) => (
                      <>
                        <tr
                          key={r.id}
                          className={`${
                            r.status === "Approved"
                              ? "bg-green-100"
                              : r.status === "Rejected"
                              ? "bg-red-100"
                              : "bg-gray-50"
                          }`}
                        >
                          <td className="border px-4 py-2">
                            <b>{r.student?.name || "-"}</b>
                            <button
                              onClick={() => toggle(r.id)}
                              className="block text-sm text-blue-600"
                            >
                              {expanded[r.id] ? "Show Less" : "Show More"}
                            </button>
                          </td>

                          <td className="border text-center font-semibold">
                            {r.status || "Pending"}
                          </td>

                          <td className="border px-4 py-2">
                            {!readOnly && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setConfirmBox({
                                      open: true,
                                      id: r.id,
                                      status: "Approved",
                                    })
                                  }
                                  className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    setConfirmBox({
                                      open: true,
                                      id: r.id,
                                      status: "Rejected",
                                    })
                                  }
                                  className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {expanded[r.id] && (
                          <tr>
                            <td colSpan="3" className="border px-4 py-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><b>Name:</b> {r.student?.name || "-"}</div>
                                <div><b>Enrollment:</b> {r.enrollment}</div>
                                <div><b>Branch / Course:</b> {r.student?.branch || r.student?.course || "-"}</div>
                                <div><b>Room Number:</b> {r.student?.roomNumber || "-"}</div>
                                <div><b>Phone:</b> {r.student?.phoneNumber || "-"}</div>
                                <div><b>Pass Type:</b> {r.passType}</div>
                                <div><b>Place:</b> {r.place || "-"}</div>
                                <div><b>Travel Date:</b> {r.travelDate ? new Date(r.travelDate).toLocaleDateString() : "-"}</div>
                                <div><b>Return Date:</b> {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "-"}</div>
                                {r.passType === "home" && (
                                  <>
                                    <div><b>Parent Name:</b> {r.parentName || "-"}</div>
                                    <div className="col-span-2"><b>Address:</b> {r.address || "-"}</div>
                                  </>
                                )}
                                <div className="col-span-2">
                                  <b>Remark:</b>
                                  <input
                                    className="w-full mt-1 border px-2 py-1 rounded"
                                    value={remarks[r.id] || r.remark || ""}
                                    onChange={(e) => setRemarks((s) => ({ ...s, [r.id]: e.target.value }))}
                                    disabled={readOnly}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW */}
              <div className="md:hidden space-y-4">
                {current.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-xl p-4 shadow transition ${
                      r.status === "Approved"
                        ? "bg-green-100"
                        : r.status === "Rejected"
                        ? "bg-red-100"
                        : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{r.student?.name || "-"}</h3>
                        <p className="text-sm text-gray-700">{r.enrollment}</p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          r.status === "Approved"
                            ? "bg-green-600 text-white"
                            : r.status === "Rejected"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {r.status || "Pending"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggle(r.id)}
                      className="text-sm text-blue-700 mt-2"
                    >
                      {expanded[r.id] ? "Show Less" : "Show More"}
                    </button>

                    {expanded[r.id] && (
                      <div className="mt-3 text-sm space-y-2">
                        <p><b>Name:</b> {r.student?.name || "-"}</p>
                        <p><b>Enrollment:</b> {r.enrollment || "-"}</p>
                        <p><b>Branch / Course:</b> {r.student?.branch || r.student?.course || "-"}</p>
                        <p><b>Room Number:</b> {r.student?.roomNumber || "-"}</p>
                        <p><b>Phone:</b> {r.student?.phoneNumber || "-"}</p>
                        <p><b>Pass Type:</b> {r.passType || "-"}</p>
                        <p><b>Place / Reason:</b> {r.place || r.reason || "-"}</p>
                        <p><b>Travel Date:</b> {r.travelDate ? new Date(r.travelDate).toLocaleDateString() : "-"}</p>
                        <p><b>Return Date:</b> {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "-"}</p>
                        {r.passType === "home" && (
                          <>
                            <p><b>Parent Name:</b> {r.parentName || "-"}</p>
                            <p><b>Address:</b> {r.address || "-"}</p>
                          </>
                        )}
                        <div>
                          <b>Remark:</b>
                          <input
                            className="w-full mt-1 border px-2 py-1 rounded"
                            value={remarks[r.id] || r.remark || ""}
                            onChange={(e) => setRemarks((s) => ({ ...s, [r.id]: e.target.value }))}
                            disabled={readOnly}
                          />
                        </div>
                        {!readOnly && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setConfirmBox({ open: true, id: r.id, status: "Approved" })}
                              className="flex-1 bg-green-600 text-white py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setConfirmBox({ open: true, id: r.id, status: "Rejected" })}
                              className="flex-1 bg-red-600 text-white py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded ${
                        p === page ? "bg-blue-600 text-white" : "text-blue-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmBox.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-bold">Confirm Action</h2>
            <p className="mt-2">
              Are you sure you want to{" "}
              <span className={`font-semibold ${confirmBox.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                {confirmBox.status}
              </span>{" "}
              this request?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmBox({ open: false, id: null, status: "" })}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(confirmBox.id, confirmBox.status)}
                className={`px-4 py-2 text-white rounded ${confirmBox.status === "Approved" ? "bg-green-600" : "bg-red-600"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
