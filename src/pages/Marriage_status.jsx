import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4" style={{ color: '#002664' }}>My Marriage Applications</h2>

      {loading && <p>Loading applications...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div>
          {records.length === 0 ? (
            <div className="text-center">
              <p>No marriage applications found for your account.</p>
              <button className="btn btn-primary" onClick={() => navigate('/services/marriage-registration')}>Start a Marriage Registration</button>
            </div>
          ) : (
            <div className="row">
              {records.map(r => (
                <div className="col-md-6 mb-3" key={r.id || r.marriage_certificate_number}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Certificate: {r.marriage_certificate_number}</h5>
                      <p className="card-text"><strong>Spouses:</strong> {r.spouse1_first_name} {r.spouse1_last_name} & {r.spouse2_first_name} {r.spouse2_last_name}</p>
                      <p className="card-text"><strong>Marriage date:</strong> {r.marriage_date}</p>
                      <p className="card-text"><strong>Status:</strong> {r.approval_status || 'pending'}</p>
                      <p className="card-text"><strong>Applied by:</strong> {r.applied_by || '—'}</p>
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
