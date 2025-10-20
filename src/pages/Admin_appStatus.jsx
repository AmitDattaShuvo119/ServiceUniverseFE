import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin_appStatus = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (!adminData?.token) {
      navigate("/admin-login");
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          "http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/pending",
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();
        setApplications(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h5>{error}</h5>
      </div>
    );

  const adminData = JSON.parse(localStorage.getItem("admin")) || {};

  return (
    <div className="container mt-5" style={{minHeight:"90vh"}}>
      <h1 className="text-center mb-4">Admin - Pending WWCC Applications</h1>
      <h5 className="text-center mb-4">
        Welcome, {adminData.username || "Admin"}!
      </h5>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Application ID</th>
              <th>Application Number</th>
              <th>Citizen ID</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No pending applications
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>{app.id}</td>
                  <td>{app.application_number || "N/A"}</td>
                  <td>{app.citizen_id || "N/A"}</td>
                  <td>{app.first_name + " " + (app.last_name || "")}</td>
                  <td>{app.email || "N/A"}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(`/view-wwccApp/${app.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin_appStatus;
