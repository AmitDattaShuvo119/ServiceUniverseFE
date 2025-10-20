import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPrint, FaCheckCircle } from 'react-icons/fa';

const Marriage_status = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

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
        setRecords(Array.isArray(data.data.marriageRecords) ? data.data.marriageRecords : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleViewCertificate = (certificateNumber) => {
    navigate(`/services/marriage-certificate/${certificateNumber}`);
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
      <h2 className="text-center mb-4" style={{ color: '#002664' }}>My Marriage Applications</h2>

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
              <p>No marriage applications found for your account.</p>
              <button className="btn btn-secondary" onClick={handleBack}>Back to services</button>
            </div>
          ) : (
            <div className="row">
              {records.map(r => (
                <div className="col-md-6 mb-4" key={r.id || r.marriage_certificate_number}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title text-primary mb-0">
                          Certificate: {r.marriage_certificate_number}
                        </h5>
                        {getStatusBadge(r.approval_status)}
                      </div>

                      <div className="mb-3">
                        <p className="card-text mb-2">
                          <strong>💍 Spouses:</strong> {r.spouse1_first_name} {r.spouse1_last_name} & {r.spouse2_first_name} {r.spouse2_last_name}
                        </p>
                        <p className="card-text mb-2">
                          <strong>📅 Marriage date:</strong> {r.marriage_date ? new Date(r.marriage_date).toLocaleDateString('en-AU') : 'N/A'}
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
                            onClick={() => handleViewCertificate(r.marriage_certificate_number)}
                          >
                            <FaEye className="me-1" />
                            View Marriage Certificate
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

export default Marriage_status;
