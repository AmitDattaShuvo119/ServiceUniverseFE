import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Death_status = () => {
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
        setRecords(Array.isArray(data.data.deathRecords) ? data.data.deathRecords : []);
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
      <h2 className="text-center mb-4" style={{ color: '#002664' }}>My Death Applications</h2>

      {loading && <p>Loading applications...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div>
          {records.length === 0 ? (
            <div className="text-center">
              <p>No death applications found for your account.</p>
              <button className="btn btn-primary" onClick={() => navigate('/services/death-registration')}>Start a Death Registration</button>
            </div>
          ) : (
            <div className="row">
              {records.map(r => (
                <div className="col-md-6 mb-3" key={r.id || r.death_certificate_number}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Certificate: {r.death_certificate_number}</h5>
                      <p className="card-text"><strong>Deceased:</strong> {r.deceased_first_name} {r.deceased_last_name}</p>
                      <p className="card-text"><strong>Date of death:</strong> {r.date_of_death}</p>
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

export default Death_status;
