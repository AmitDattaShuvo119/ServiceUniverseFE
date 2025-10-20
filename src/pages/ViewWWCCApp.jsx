import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewWwccApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (!adminData?.token) {
      navigate("/admin-login");
      return;
    }

    const fetchApplication = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/${id}`,
          { headers: { Authorization: `Bearer ${adminData.token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch application details");

        const data = await res.json();
        setApplication(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleApprove = async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const res = await fetch(
        `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/${id}/approve`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${adminData.token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to approve application");
      alert("✅ Application approved successfully!");
      navigate("/admin-applications");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a rejection reason.");
      return;
    }
    try {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const res = await fetch(
        `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminData.token}`,
          },
          body: JSON.stringify({ rejection_reason: rejectionReason }),
        }
      );

      if (!res.ok) throw new Error("Failed to reject application");
      alert("🚫 Application rejected successfully!");
      navigate("/admin-applications");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h5>{error}</h5>
      </div>
    );

  const adminData = JSON.parse(localStorage.getItem("admin")) || {};

  return (
    <div className="container mt-5" style={{ minHeight: "90vh" }}>
      <h2 className="mb-4">WWCC Application Details</h2>
      <h5 className="mb-4">Welcome, {adminData.username || "Admin"}!</h5>

      <div className="card mb-4">
        <div className="card-body">
          <p>
            <strong>Application Number:</strong>{" "}
            {application.application_number}
          </p>
          <p>
            <strong>Citizen ID:</strong> {application.citizen_id}
          </p>
          <p>
            <strong>Name:</strong> {application.first_name}{" "}
            {application.last_name}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(application.date_of_birth).toLocaleDateString()}
          </p>
          <p>
            <strong>Gender:</strong> {application.gender}
          </p>
          <p>
            <strong>Email:</strong> {application.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {application.phone_number}
          </p>
          <p>
            <strong>Address:</strong> {application.address}
          </p>
          <p>
            <strong>Identity Documents:</strong>{" "}
            {application.identity_documents.split(",").map((doc, i) => (
              <a
                key={i}
                href={`http://localhost:3000${doc}`}
                target="_blank"
                rel="noreferrer"
              >
                View Doc {i + 1}{" "}
              </a>
            ))}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Enter rejection reason (if rejecting)"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </div>

      <div>
        <button className="btn btn-success me-2" onClick={handleApprove}>
          Approve
        </button>
        <button className="btn btn-danger" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default ViewWwccApp;
