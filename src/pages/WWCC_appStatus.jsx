import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const WWCC_appStatus = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        const citizenId = user?.citizen_id;

        if (!token || !citizenId) {
          setError("Please log in to view your application status.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/citizen/${citizenId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application data.");
        }

        const data = await response.json();

        if (!data?.data || data.data.length === 0) {
          setError("No WWCC application found for this account.");
          setLoading(false);
          return;
        }

        // Get the latest application (assuming sorted by created_at)
        const latestApp = data.data[data.data.length - 1];

        setApplicationData({
          submittedDate: new Date(latestApp.created_at).toLocaleDateString(),
          status:
            latestApp.approval_status.charAt(0).toUpperCase() +
            latestApp.approval_status.slice(1), // capitalize first letter
          approvalNotes: latestApp.approval_notes || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching WWCC application:", err);
        setError("An error occurred while fetching your application.");
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center" style={{ minHeight: "90vh" }}>
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ minHeight: "90vh" }}>
      <h1 className="text-center mb-4">WWCC Application Progress</h1>
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">Application Details</h5>
          <p className="card-text">
            <strong>Submitted Date:</strong> {applicationData.submittedDate}
          </p>
          <p className="card-text">
            <strong>Status:</strong>{" "}
            <span
              className={
                applicationData.status === "Approved"
                  ? "text-success"
                  : applicationData.status === "Pending"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {applicationData.status}
            </span>
          </p>

          {applicationData.approvalNotes && (
            <p className="card-text">
              <strong>Officer Notes:</strong> {applicationData.approvalNotes}
            </p>
          )}

          <div className="mt-4">
            {applicationData.status === "Pending" && (
              <button
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </button>
            )}
            {applicationData.status === "Approved" && (
              <button className="btn btn-success">View Certificate</button>
            )}
            {applicationData.status === "Rejected" && (
              <button className="btn btn-danger">Contact Support</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WWCC_appStatus;
