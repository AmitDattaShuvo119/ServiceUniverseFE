import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeartbeat } from "react-icons/fa";

const SERVICE_CARDS = [
  { id: "births", title: "Birth Registrations", desc: "Pending birth certificate applications", adminEndpoint: "/birthRecords/api/birth-records/admin/pending" },
  { id: "deaths", title: "Death Registrations", desc: "Pending death certificate applications", adminEndpoint: "/deathRecords/api/death-records/admin/pending" },
  { id: "marriages", title: "Marriage Registrations", desc: "Pending marriage certificate applications", adminEndpoint: "/marriageRecords/api/marriage-records/admin/pending" },
  { id: "wwcc", title: "WWCC Applications", desc: "Pending WWCC screening applications", adminEndpoint: "wwccProvider/api/wwcc-applications/admin/pending" },
];

const Admin_appStatus = () => {
  const navigate = useNavigate();
  // per-service pages will handle fetching

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (!adminData?.token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  

  const onCardClick = (svc) => {
    // navigate to per-service admin page
    navigate(`/admin-applications/${svc.id}`);
  };

  const adminData = JSON.parse(localStorage.getItem("admin")) || {};

  return (
    <div className="container mt-4" style={{ minHeight: "90vh" }}>
      <h1 className="text-center mb-3">Admin - Pending Applications</h1>
      <h5 className="text-center mb-4">Welcome, {adminData.username || "Admin"}!</h5>

      <div className="row g-3 mb-4">
        {SERVICE_CARDS.map((svc) => (
          <div className="col-12 col-md-6 col-lg-3" key={svc.id}>
            <div className={`card h-100`} style={{cursor:'pointer'}} onClick={() => onCardClick(svc)}>
              <div className="card-body">
                <h5 className="card-title">{svc.title}</h5>
                <p className="card-text text-muted">{svc.desc}</p>
                <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); onCardClick(svc); }}>
                  View Pending
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vaccination Management Card */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <div className="card h-100" style={{cursor:'pointer'}} onClick={() => navigate('/services/add-vaccination-record')}>
            <div className="card-body text-center">
              <FaHeartbeat className="text-success mb-3" size={40} />
              <h5 className="card-title">Vaccination Records</h5>
              <p className="card-text text-muted">Manage citizen vaccination records and certificates</p>
              <button className="btn btn-success">
                Add Vaccination Record
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
      <div className="text-center text-muted">Select a service above to view pending applications.</div>
      </div>
    </div>
  );
};

export default Admin_appStatus;
