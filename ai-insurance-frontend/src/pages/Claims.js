import { useEffect, useMemo, useState } from "react";

function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ reason: "", amount: "" });
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
      const matchesSearch = claim.reason.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchQuery]);

  const totalAmount = useMemo(
    () => filteredClaims.reduce((sum, claim) => sum + Number(claim.amount || 0), 0),
    [filteredClaims]
  );

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/claim", {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to fetch claims");
        setClaims([]);
      } else {
        setClaims(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      setMessage("Error fetching claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ reason: "", amount: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const reason = form.reason.trim();
    const amount = Number(form.amount);
    const status = reason.toLowerCase().includes("rain") ? "approved" : "pending";

    if (!reason || Number.isNaN(amount) || amount <= 0) {
      setMessage("Enter valid reason and amount");
      return;
    }

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `http://localhost:5000/api/claim/${editingId}`
        : "http://localhost:5000/api/claim";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason, amount, status })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Operation failed");
        return;
      }

      setMessage(isEdit ? "Claim updated" : "Claim submitted");
      resetForm();
      await fetchClaims();
    } catch (error) {
      console.error("Error saving claim:", error);
      setMessage("Error saving claim");
    }
  };

  const startEdit = (claim) => {
    setEditingId(claim._id);
    setForm({ reason: claim.reason, amount: String(claim.amount) });
    setMessage("");
  };

  const cancelEdit = () => {
    resetForm();
    setMessage("Edit cancelled");
  };

  const deleteClaim = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/claim/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage("Claim deleted");
      await fetchClaims();
    } catch (error) {
      console.error("Error deleting claim:", error);
      setMessage("Error deleting claim");
    }
  };

  const simulateRain = () => {
    const isFraud = Math.random() < 0.5;

    const newClaim = {
      id: Date.now(),
      status: isFraud ? "Rejected ❌" : "Approved ✅",
      reason: isFraud ? "Fake Location detected" : "",
      payoutMessage: isFraud ? "" : "₹500 credited successfully"
    };

    setClaims((prev) => [newClaim, ...prev]);
  };

  return (
    <div className="claims-page container mt-4">
      <div className="claims-header mb-4">
        <h2 className="mb-1">Claims Center</h2>
        <p className="text-muted mb-0">Submit, track, update and manage your insurance claims</p>
      </div>

      <div className="card p-3 mb-4 claims-form-card">
        <h5>{editingId ? "Update Claim" : "Submit New Claim"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              className="form-control"
              name="reason"
              placeholder="Claim reason"
              value={form.reason}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <input
              className="form-control"
              name="amount"
              type="number"
              min="1"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary me-2" type="submit">
            {editingId ? "Update" : "Submit"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
          <button 
            className="btn btn-info" 
            type="button" 
            onClick={simulateRain}
          >
            Simulate Rain 🌧️
          </button>
        </form>
      </div>

      <div className="card p-3 claims-list-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Your Claims</h5>
          <div className="claims-total">Total Amount: Rs.{totalAmount}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder="Search by reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-control form-control-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {message && <div className="alert alert-info py-2">{message}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          claims.length === 0 ? (
            <p>No claims found</p>
          ) : (
            claims.map((claim) => (
              <div key={claim.id}>
                <p>Status: {claim.status}</p>
                {claim.reason && <p>Reason: {claim.reason}</p>}
                {claim.payoutMessage && <p>💸 {claim.payoutMessage}</p>}
                <hr />
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

export default Claims;
