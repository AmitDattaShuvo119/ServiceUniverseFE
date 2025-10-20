import React from "react";
import { useNavigate } from "react-router-dom";

const WWCC_feedback = () => {
  const navigate = useNavigate();

  const handleTrackApplication = () => {
    navigate("/services/wwcc-status");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#002664", marginBottom: "20px" }}>
          WWCC Application Submitted
        </h1>
        <p style={{ color: "#333", fontSize: "1.1em", lineHeight: "1.6em" }}>
          Thank you for submitting your Working With Children Check (WWCC)
          application. We have received your details and will process your
          application shortly. You will be notified via email within 7 days once
          your application has been reviewed.
        </p>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={handleTrackApplication}
            className="btn btn-lg apply-btn"
            style={{ backgroundColor: "#002664", color: "white" }}
          >
            Track my Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default WWCC_feedback;
