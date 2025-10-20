import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './AdminPages.module.css';

const AdminWWCC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    if (!adminData.token) return navigate('/admin-login');

    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/pending', {
          headers: { Authorization: `Bearer ${adminData.token}` }
        });
        if (!res.ok) throw new Error('Failed to load pending wwcc apps');
        const body = await res.json();
        setApplications(body.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [navigate]);

  return (
    <div className="container-fluid px-4">
      {/* Header Section */}
      <div className={styles.adminHeader}>
        <div className="text-center">
          <FaShieldAlt className={styles.headerIcon} />
          <h2>WWCC Application Management</h2>
          <p className="mb-0 opacity-75">Review and process Working With Children Check applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaShieldAlt className="text-warning mb-2" size={30} />
              <div className={styles.statsNumber}>{applications.length}</div>
              <div className={styles.statsLabel}>Pending Applications</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaCalendarAlt className="text-success mb-2" size={30} />
              <div className={styles.statsNumber}>
                {applications.filter(app => {
                  const today = new Date();
                  const submitted = new Date(app.created_at);
                  return (today - submitted) / (1000 * 60 * 60 * 24) <= 7;
                }).length}
              </div>
              <div className={styles.statsLabel}>This Week</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaUserShield className="text-info mb-2" size={30} />
              <div className={styles.statsNumber}>
                {applications.filter(app => app.status === 'approved').length}
              </div>
              <div className={styles.statsLabel}>Approved Today</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaEye className="text-primary mb-2" size={30} />
              <div className={styles.statsNumber}>
                {applications.length > 0 ? Math.round(applications.length / 30) : 0}
              </div>
              <div className={styles.statsLabel}>Avg. Monthly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h5>Loading applications...</h5>
        </div>
      ) : error ? (
        <div className={`alert ${styles.errorAlert}`}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Pending WWCC Applications</h4>
            <small className="text-muted">Total: {applications.length} applications</small>
          </div>
          {applications.length === 0 ? (
            <div className={styles.emptyState}>
              <FaShieldAlt className={styles.emptyStateIcon} />
              <h5>No pending applications</h5>
              <p>All WWCC applications have been processed.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className={`table ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th><FaShieldAlt className="me-2" />Applicant Name</th>
                    <th>Citizen ID</th>
                    <th><FaCalendarAlt className="me-2" />Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr key={app.id || i}>
                      <td>
                        <span className="badge bg-warning rounded-pill">{i+1}</span>
                      </td>
                      <td>
                        <code>{app.id || 'N/A'}</code>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaShieldAlt className="text-warning me-2" />
                          <strong>{(app.first_name || '') + ' ' + (app.last_name || '')}</strong>
                        </div>
                      </td>
                      <td>
                        <code>{app.citizen_id || app.applied_by || 'N/A'}</code>
                      </td>
                      <td>
                        <small className="text-muted">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                        </small>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${styles.actionButton}`}
                          onClick={() => navigate(`/admin-applications/view/wwcc/${app.id}`)}
                        >
                          <FaEye className="me-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWWCC;
