import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentRequest({ readOnly = false }) {
  const [requests, setRequests] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' | 'reject'
  const [actionMessage, setActionMessage] = useState("");
  const [actionMessageType, setActionMessageType] = useState("info"); // info|success|error

  // show a small message when in readOnly mode
  useEffect(() => {
    if (readOnly) document.title = "Requests (Read-only)";
  }, [readOnly]);

  useEffect(() => {
    const q = query(collection(db, "passRequest"), orderBy("submittedAt", "desc"));
    const unsub = onSnapshot(q, async (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // fetch student details for unique enrollments
      const enrollments = [...new Set(docs.map((r) => r.enrollment))];
      const studentMap = {};

      await Promise.all(
        enrollments.map(async (enr) => {
          try {
            const sDoc = await getDoc(doc(db, "students", enr));
            studentMap[enr] = sDoc.exists() ? sDoc.data() : null;
          } catch {
            studentMap[enr] = null;
          }
        })
      );

      const merged = docs.map((r) => ({ ...r, student: studentMap[r.enrollment] || null }));
      setRequests(merged);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered = requests.filter((r) => {
    if (filterType !== "all" && r.passType !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const handleApprove = async (reqId) => {
    if (!window.confirm("Approve this request?")) return;
    try {
      setActionLoadingId(reqId);
      setActionType("approve");
      setActionMessage("Approving request...");
      setActionMessageType("info");

      const user = auth.currentUser;
      await updateDoc(doc(db, "passRequest", reqId), {
        status: "Approved",
        approvedAt: new Date().toISOString(),
        remark: remarks[reqId] || "",
        approvedBy: user?.uid || null,
        approverEmail: user?.email || null,
      });

      setActionMessage("Request approved successfully.");
      setActionMessageType("success");
      toast.success("Request approved");
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to approve request.");
      setActionMessageType("error");
      toast.error("Failed to approve request");
      setTimeout(() => setActionMessage(""), 3000);
    } finally {
      setActionLoadingId(null);
      setActionType("");
    }
  };

  const handleReject = async (reqId) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      setActionLoadingId(reqId);
      setActionType("reject");
      setActionMessage("Rejecting request...");
      setActionMessageType("info");

      const user = auth.currentUser;
      await updateDoc(doc(db, "passRequest", reqId), {
        status: "Rejected",
        approvedAt: new Date().toISOString(),
        remark: remarks[reqId] || "",
        approvedBy: user?.uid || null,
        approverEmail: user?.email || null,
      });

      setActionMessage("Request rejected.");
      setActionMessageType("success");
      toast.success("Request rejected");
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to reject request.");
      setActionMessageType("error");
      toast.error("Failed to reject request");
      setTimeout(() => setActionMessage(""), 3000);
    } finally {
      setActionLoadingId(null);
      setActionType("");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Student Pass Requests</h1>

        <div className="flex gap-4 mb-4">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All Types</option>
            <option value="home">Home</option>
            <option value="local">Local</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {readOnly && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">You are viewing the requests in read-only mode. To approve/reject, please log in as a warden.</div>
        )}

        {actionMessage && (
          <div className={`mb-4 p-3 rounded text-sm ${actionMessageType === "success" ? "bg-green-50 border border-green-200 text-green-700" : actionMessageType === "error" ? "bg-red-50 border border-red-200 text-red-700" : "bg-blue-50 border border-blue-200 text-blue-700"}`}>
            {actionMessage}
          </div>
        )}

        <ToastContainer />

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Enrollment</th>
                  <th className="border px-4 py-2">Pass Type</th>
                  <th className="border px-4 py-2">Place / Reason</th>
                  <th className="border px-4 py-2">Travel Date</th>
                  <th className="border px-4 py-2">Return Date</th>
                  <th className="border px-4 py-2">Submitted</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Remark</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className={`text-center ${r.status === "Approved" ? "bg-green-50" : r.status === "Rejected" ? "bg-red-50" : "bg-gray-50"}`}>
                    <td className="border px-4 py-2">{r.name || r.student?.name || "-"}</td>
                    <td className="border px-4 py-2">{r.enrollment}</td>
                    <td className="border px-4 py-2">{r.passType}</td>
                    <td className="border px-4 py-2">{r.place || r.reason || "-"}</td>
                    <td className="border px-4 py-2">{r.travelDate ? new Date(r.travelDate).toLocaleDateString() : "-"}</td>
                    <td className="border px-4 py-2">{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "-"}</td>
                    <td className="border px-4 py-2">{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "-"}</td>
                    <td className="border px-4 py-2 font-semibold">{r.status || "Pending"}</td>
                    <td className="border px-4 py-2">
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={remarks[r.id] || r.remark || ""}
                        onChange={(e) => setRemarks((s) => ({ ...s, [r.id]: e.target.value }))}
                        disabled={readOnly}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      {readOnly ? (
                        <span className="text-sm text-gray-600">View only</span>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApprove(r.id)}
                            disabled={actionLoadingId === r.id}
                            className="py-1 px-3 bg-green-600 text-white rounded disabled:opacity-50"
                          >
                            {actionLoadingId === r.id && actionType === "approve" ? "Approving..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            disabled={actionLoadingId === r.id}
                            className="py-1 px-3 bg-red-600 text-white rounded disabled:opacity-50"
                          >
                            {actionLoadingId === r.id && actionType === "reject" ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
