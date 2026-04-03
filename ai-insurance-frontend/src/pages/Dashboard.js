import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [claimsCount, setClaimsCount] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const getRiskLevel = (claims) => {
    if (claims >= 2) return "High";
    else if (claims === 1) return "Medium";
    else return "Low";
  };

  const getPremium = (riskLevel) => {
    if (riskLevel === "Low") return 100;
    if (riskLevel === "Medium") return 200;
    if (riskLevel === "High") return 300;
    return 0;
  };

  const riskLevel = useMemo(() => getRiskLevel(claimsCount), [claimsCount]);
  const weeklyPremium = useMemo(() => getPremium(riskLevel), [riskLevel]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/claim", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setClaimsCount(list.length);

        const approvedTotal = list
          .filter((item) => item.status === "approved")
          .reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setEarnings(approvedTotal);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page container mt-5">
      <div className="text-center mb-4">
        <h2 className="mb-1">Dashboard</h2>
        <p className="text-muted mb-0">Quick overview of your insurance activity</p>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm dashboard-stat-card">
            <h6 className="text-muted">Approved Earnings</h6>
            <h3 className="mb-0">Rs.{earnings}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm dashboard-stat-card">
            <h6 className="text-muted">Total Claims</h6>
            <h3 className="mb-0">{claimsCount}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm dashboard-stat-card">
            <h6 className="text-muted">Risk Level</h6>
            <h3 className="mb-0">
              <span className={`badge ${riskLevel === "Low" ? "bg-success" : riskLevel === "Medium" ? "bg-warning text-dark" : "bg-danger"}`}>
                {riskLevel}
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm dashboard-stat-card">
            <h6 className="text-muted">Weekly Premium</h6>
            <h3 className="mb-0">Rs.{weeklyPremium}</h3>
            <small className="text-muted">Based on {riskLevel} risk</small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm dashboard-stat-card">
            <h6 className="text-muted">Monthly Estimate</h6>
            <h3 className="mb-0">Rs.{weeklyPremium * 4}</h3>
            <small className="text-muted">{weeklyPremium} × 4 weeks</small>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success me-2" onClick={() => navigate("/policy")}>
          Buy Insurance
        </button>

        <button className="btn btn-warning" onClick={() => navigate("/claims")}>
          View Claims
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
