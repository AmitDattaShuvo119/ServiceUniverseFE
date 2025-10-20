import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPrint, FaCheckCircle } from 'react-icons/fa';

const Death_status = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  // Helper function to format date from milliseconds
  const formatDate = (dateValue) => {
    if (!dateValue) return '—';
    try {
      // If it's already a string date, try to parse it
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        return date.toLocaleDateString('en-AU');
      }
      // If it's milliseconds, convert to date
      const date = new Date(parseInt(dateValue));
      return date.toLocaleDateString('en-AU');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;
      if (!token) {
        setError('You must be logged in to view application status.');
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch('http://localhost:3000/api/citizens/summary', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error('Failed to fetch summary');
        const data = await resp.json();
        setRecords(Array.isArray(data.data.deathRecords) ? data.data.deathRecords : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus()
  }, []);

  const handleViewCertificate = (certificateNumber) => {
    navigate(`/services/death-certificate/${certificateNumber}`);
  };

  const handleBack = () => navigate('/services');

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'approved') {
      return <span className="badge bg-success"><FaCheckCircle className="me-1" />Approved</span>;
    } else if (statusLower === 'rejected') {
      return <span className="badge bg-danger">Rejected</span>;
    } else if (statusLower === 'pending') {
      return <span className="badge bg-warning">Pending</span>;
    }
    return <span className="badge bg-secondary">{status || 'Unknown'}</span>;
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4" style={{ color: '#002664' }}>My Death Applications</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading applications...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {records.length === 0 ? (
            <div className="text-center">
              <p>No death applications found for your account.</p>
              <button className="btn btn-secondary" onClick={handleBack}>Back to services</button>
            </div>
          ) : (
            <div className="row">
              {records.map(r => (
                <div className="col-md-6 mb-4" key={r.id || r.death_certificate_number}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title text-primary mb-0">
                          Certificate: {r.death_certificate_number}
                        </h5>
                        {getStatusBadge(r.approval_status)}
                      </div>

                      <div className="mb-3">
                        <p className="card-text mb-2">
                          <strong>💀 Deceased:</strong> {r.deceased_first_name} {r.deceased_last_name}
                        </p>
                        <p className="card-text mb-2">
                          <strong>📅 Date of death:</strong> {formatDate(r.date_of_death)}
                        </p>
                        <p className="card-text mb-2">
                          <strong>👤 Applied by:</strong> {r.applied_by || '—'}
                        </p>
                        {r.approved_by && (
                          <p className="card-text mb-2">
                            <strong>✅ Approved by:</strong> {r.approved_by}
                          </p>
                        )}
                        {r.approval_date && (
                          <p className="card-text mb-2">
                            <strong>📆 Approval date:</strong> {new Date(r.approval_date).toLocaleDateString('en-AU')}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto">
                        {(r.approval_status || '').toLowerCase() === 'approved' && (
                          <button
                            className="btn btn-success me-2 mb-2"
                            onClick={() => handleViewCertificate(r.death_certificate_number)}
                          >
                            <FaEye className="me-1" />
                            View Death Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Death_status;
