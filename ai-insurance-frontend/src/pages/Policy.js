import { useEffect, useState, useMemo } from "react";

function Policy() {
  const [claimsCount, setClaimsCount] = useState(0);
  const [weeklyPremium, setWeeklyPremium] = useState(0);

  const getRiskLevel = (claims) => {
    if (claims === 0) return "Low";
    else if (claims <= 2) return "Medium";
    else return "High";
  };

  const getPremium = (riskLevel) => {
    if (riskLevel === "Low") return 100;
    if (riskLevel === "Medium") return 200;
    if (riskLevel === "High") return 300;
    return 0;
  };

  const riskLevel = useMemo(() => getRiskLevel(claimsCount), [claimsCount]);

  useEffect(() => {
    const fetchClaimsData = async () => {
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
        setWeeklyPremium(getPremium(getRiskLevel(list.length)));
      } catch (error) {
        console.error("Error loading policy data:", error);
      }
    };

    fetchClaimsData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="policy-header mb-4">
        <h2 className="mb-1">My Insurance Policy</h2>
        <p className="text-muted mb-0">Review your coverage details and benefits</p>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Policy Details</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="mb-2">
              <label className="text-muted">Policy Number</label>
              <p className="h6">POL-2024-001</p>
            </div>
            <div className="mb-2">
              <label className="text-muted">Status</label>
              <p><span className="badge bg-success">Active</span></p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="mb-2">
              <label className="text-muted">Policy Type</label>
              <p className="h6">Income Protection Insurance</p>
            </div>
            <div className="mb-2">
              <label className="text-muted">Risk Level</label>
              <p>
                <span className={`badge ${riskLevel === "Low" ? "bg-success" : riskLevel === "Medium" ? "bg-warning text-dark" : "bg-danger"}`}>
                  {riskLevel}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Premium Details</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="mb-2">
              <label className="text-muted">Weekly Premium</label>
              <p className="h5">Rs.{weeklyPremium}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="mb-2">
              <label className="text-muted">Monthly Estimate</label>
              <p className="h5">Rs.{weeklyPremium * 4}</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="mb-2">
              <label className="text-muted">Total Claims</label>
              <p className="h5">{claimsCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4 text-center bg-light border-primary">
        <h3 className="mb-1">Weekly Premium</h3>
        <h2 className="text-primary fw-bold">₹{weeklyPremium}/week</h2>
        <small className="text-muted">Based on {riskLevel} risk level</small>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Coverage Benefits</h5>
        <ul className="list-unstyled">
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            Income loss protection during heavy rain
          </li>
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            Compensation for delivery disruption due to traffic congestion
          </li>
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            Coverage during curfew or restricted movement
          </li>
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            Automatic claim approval for verified events
          </li>
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            Weekly payout support for missed delivery income
          </li>
          <li className="mb-2">
            <span className="badge bg-primary me-2">✓</span>
            AI-based risk detection using weather and traffic conditions
          </li>
        </ul>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Quick Actions</h5>
        <div className="d-grid gap-2 d-md-flex">
          <a href="/claims" className="btn btn-primary">
            Submit a Claim
          </a>
          <a href="/dashboard" className="btn btn-outline-primary">
            View Dashboard
          </a>
          <button className="btn btn-outline-secondary">
            Download Policy Document
          </button>
        </div>
      </div>

      <div className="alert alert-info" role="alert">
        <strong>Need Help?</strong> Contact our support team at support@aiinsurance.com or call +91-1800-123-4567
      </div>
    </div>
  );
}

export default Policy;