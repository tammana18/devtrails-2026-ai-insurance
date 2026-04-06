import React, { useEffect, useState } from "react";

function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsiveCardStyle = {
    ...cardStyle,
    width: isMobile ? "100%" : "220px"
  };

  return (
    <div style={{ 
      padding: "30px", 
      backgroundColor: "#f5f7fa",
      minHeight: "100vh"
    }}>
      
      {/* Title */}
      <h2 style={{ marginBottom: "5px" }}>Insurance Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        AI-powered income protection overview
      </p>

      {/* Stats Cards */}
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        flexWrap: "wrap",
        marginBottom: "30px"
      }}>
        
        <div style={responsiveCardStyle}>
          <h3>Policy</h3>
          <p>Active ✅</p>
        </div>

        <div style={responsiveCardStyle}>
          <h3>Earnings Protected</h3>
          <p>₹2000 💰</p>
        </div>

        <div style={responsiveCardStyle}>
          <h3>Total Claims</h3>
          <p>5 📄</p>
        </div>

        <div style={responsiveCardStyle}>
          <h3>Fraud Detected</h3>
          <p>1 ❌</p>
        </div>

      </div>

      {/* AI Prediction */}
      <div style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff3cd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <h3>AI Insight 🔮</h3>
        <p>⚠️ High chance of rain this week → Increased claim probability</p>
      </div>

      {/* Recent Activity */}
      <div style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <h3>Recent Activity</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Claim Approved ✅ ₹500 credited</li>
          <li>Fraud Claim Rejected ❌</li>
          <li>Policy Active</li>
        </ul>
      </div>

    </div>
  );
}

// Card style
const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

export default Dashboard;