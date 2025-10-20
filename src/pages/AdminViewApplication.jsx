import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBaby, FaCross, FaHeart, FaShieldAlt, FaEye, FaCheck, FaTimes, FaArrowLeft, FaCalendarAlt, FaUser, FaIdCard, FaFileAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './AdminPages.module.css';

const SERVICE_CONFIG = {
  births: {
    icon: FaBaby,
    color: 'primary',
    title: 'Birth Registration Details',
    endpoint: '/birthRecords/api/birth-records'
  },
  deaths: {
    icon: FaCross,
    color: 'danger',
    title: 'Death Registration Details',
    endpoint: '/deathRecords/api/death-records'
  },
  marriages: {
    icon: FaHeart,
    color: 'danger',
    title: 'Marriage Registration Details',
    endpoint: '/marriageRecords/api/marriage-records'
  },
  wwcc: {
    icon: FaShieldAlt,
    color: 'warning',
    title: 'WWCC Application Details',
    endpoint: '/wwccProvider/api/wwcc-applications'
  }
};

const AdminViewApplication = () => {
  const { service, id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const serviceConfig = SERVICE_CONFIG[service];
  const IconComponent = serviceConfig?.icon || FaFileAlt;

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    if (!adminData.token) return navigate('/admin-login');

    if (!serviceConfig) {
      setError('Unknown service');
      setLoading(false);
      return;
    }

    const base = serviceConfig.endpoint.startsWith('/') ? serviceConfig.endpoint : `/${serviceConfig.endpoint}`;
    const fetchUrl = `http://localhost:3000/api/services${base}/${id}`;

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await fetch(fetchUrl, { headers: { Authorization: `Bearer ${adminData.token}` } });
        if (!res.ok) throw new Error('Failed to fetch record');
        const body = await res.json();
        setRecord(body.data || body);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [service, id, navigate, serviceConfig]);

  const handleApprove = async () => {
    if (!serviceConfig || !record) return;

    setActionLoading(true);
    try {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      const base = serviceConfig.endpoint.startsWith('/') ? serviceConfig.endpoint : `/${serviceConfig.endpoint}`;

      // For births, use birth certificate number; for others, use record.id
      const approvalId = service === 'births' ? (record.birth_certificate_number || record.certificateNumber) : record.id;

      const res = await fetch(
        `http://localhost:3000/api/services${base}/${approvalId}/approve`,
        {
          method: service === 'wwcc' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminData.token}`
          },
          body: JSON.stringify({
            notes: 'Application approved by admin',
            approved_by: adminData.username || 'Admin',
            approved_at: new Date().toISOString()
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to approve application');
      alert('✅ Application approved successfully!');
      navigate(`/admin-applications/${service}`);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    if (!serviceConfig || !record) return;

    setActionLoading(true);
    try {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      const base = serviceConfig.endpoint.startsWith('/') ? serviceConfig.endpoint : `/${serviceConfig.endpoint}`;

      // For births, use birth certificate number; for others, use record.id
      const rejectionId = service === 'births' ? (record.birth_certificate_number || record.certificateNumber) : record.id;

      const res = await fetch(
        `http://localhost:3000/api/services${base}/${rejectionId}/reject`,
        {
          method: service === 'wwcc' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminData.token}`,
          },
          body: JSON.stringify({
            rejection_reason: rejectionReason,
            notes: `Application rejected: ${rejectionReason}`,
            rejected_by: adminData.username || 'Admin',
            rejected_at: new Date().toISOString()
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to reject application');
      alert('🚫 Application rejected successfully!');
      navigate(`/admin-applications/${service}`);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatFieldName = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatFieldValue = (key, value) => {
    if (!value) return 'N/A';

    // Format dates
    if (key.includes('date') || key.includes('created_at') || key.includes('updated_at')) {
      try {
        return new Date(value).toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return value;
      }
    }

    // Format arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Format boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  };

  const renderField = (key, value, isImportant = false) => {
    if (!value && !isImportant) return null;

    return (
      <div key={key} className="mb-3">
        <dt className="col-sm-4 fw-semibold text-muted">{formatFieldName(key)}:</dt>
        <dd className="col-sm-8">{formatFieldValue(key, value)}</dd>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid px-4">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h5>Loading application details...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4">
        <div className={`alert ${styles.errorAlert} mt-4`}>
          <strong>Error:</strong> {error}
        </div>
        <div className="text-center mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/admin-applications/${service}`)}
          >
            <FaArrowLeft className="me-2" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const adminData = JSON.parse(localStorage.getItem('admin')) || {};

  return (
    <div className="container-fluid px-4">
      {/* Header Section */}
      <div className={styles.adminHeader}>
        <div className="text-center">
          <IconComponent className={styles.headerIcon} />
          <h2>{serviceConfig?.title || 'Application Details'}</h2>
          <p className="mb-0 opacity-75">Review and process the application details below</p>
        </div>
      </div>

      {/* Application Info Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaIdCard className={`text-${serviceConfig?.color || 'primary'} mb-2`} size={30} />
              <div className={styles.statsNumber}>{id}</div>
              <div className={styles.statsLabel}>Application ID</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={styles.statsCard}>
            <div className="text-center">
              <FaUser className="text-info mb-2" size={30} />
              <div className={styles.statsNumber}>{adminData.username || 'Admin'}</div>
              <div className={styles.statsLabel}>Reviewing Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.tableContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            <IconComponent className={`text-${serviceConfig?.color || 'primary'} me-2`} />
            Application Information
          </h4>
          <small className="text-muted">Service: {service.toUpperCase()}</small>
        </div>

        {record ? (
          <div className="row">
            <div className="col-12">
              <dl className="row">
                {/* Special handling for different services */}
                {service === 'births' && (
                  <>
                    {renderField('birth_certificate_number', record.birth_certificate_number, true)}
                    {renderField('child_first_name', record.child_first_name, true)}
                    {renderField('child_last_name', record.child_last_name, true)}
                    {renderField('date_of_birth', record.date_of_birth, true)}
                    {renderField('mother_first_name', record.mother_first_name)}
                    {renderField('mother_last_name', record.mother_last_name)}
                    {renderField('mother_citizen_id', record.mother_citizen_id)}
                    {renderField('father_first_name', record.father_first_name)}
                    {renderField('father_last_name', record.father_last_name)}
                    {renderField('father_citizen_id', record.father_citizen_id)}
                  </>
                )}

                {service === 'deaths' && (
                  <>
                    {renderField('deceased_first_name', record.deceased_first_name, true)}
                    {renderField('deceased_last_name', record.deceased_last_name, true)}
                    {renderField('date_of_death', record.date_of_death, true)}
                    {renderField('deceased_citizen_id', record.deceased_citizen_id)}
                    {renderField('place_of_death', record.place_of_death)}
                    {renderField('cause_of_death', record.cause_of_death)}
                  </>
                )}

                {service === 'marriages' && (
                  <>
                    {renderField('partner1_first_name', record.partner1_first_name, true)}
                    {renderField('partner1_last_name', record.partner1_last_name, true)}
                    {renderField('partner1_citizen_id', record.partner1_citizen_id)}
                    {renderField('partner2_first_name', record.partner2_first_name, true)}
                    {renderField('partner2_last_name', record.partner2_last_name, true)}
                    {renderField('partner2_citizen_id', record.partner2_citizen_id)}
                    {renderField('marriage_date', record.marriage_date)}
                    {renderField('ceremony_location', record.ceremony_location)}
                  </>
                )}

                {service === 'wwcc' && (
                  <>
                    {renderField('application_number', record.application_number, true)}
                    {renderField('first_name', record.first_name, true)}
                    {renderField('last_name', record.last_name, true)}
                    {renderField('citizen_id', record.citizen_id)}
                    {renderField('date_of_birth', record.date_of_birth)}
                    {renderField('gender', record.gender)}
                    {renderField('email', record.email)}
                    {renderField('phone_number', record.phone_number)}
                    {renderField('address', record.address)}
                    {record.identity_documents && (
                      <div className="mb-3">
                        <dt className="col-sm-4 fw-semibold text-muted">Identity Documents:</dt>
                        <dd className="col-sm-8">
                          {record.identity_documents.split(',').map((doc, i) => (
                            <a
                              key={i}
                              href={`http://localhost:3000${doc}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary me-2 mb-1"
                            >
                              <FaEye className="me-1" />
                              View Doc {i + 1}
                            </a>
                          ))}
                        </dd>
                      </div>
                    )}
                  </>
                )}

                {/* Render remaining fields that weren't specially handled */}
                {Object.keys(record).map(key => {
                  const specialFields = {
                    births: ['birth_certificate_number', 'child_first_name', 'child_last_name', 'date_of_birth', 'mother_first_name', 'mother_last_name', 'mother_citizen_id', 'father_first_name', 'father_last_name', 'father_citizen_id'],
                    deaths: ['deceased_first_name', 'deceased_last_name', 'date_of_death', 'deceased_citizen_id', 'place_of_death', 'cause_of_death'],
                    marriages: ['partner1_first_name', 'partner1_last_name', 'partner1_citizen_id', 'partner2_first_name', 'partner2_last_name', 'partner2_citizen_id', 'marriage_date', 'ceremony_location'],
                    wwcc: ['application_number', 'first_name', 'last_name', 'citizen_id', 'date_of_birth', 'gender', 'email', 'phone_number', 'address', 'identity_documents']
                  };

                  if (!specialFields[service]?.includes(key)) {
                    return renderField(key, record[key]);
                  }
                  return null;
                })}
              </dl>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FaFileAlt className={styles.emptyStateIcon} />
            <h5>No record data available</h5>
            <p>The application details could not be loaded.</p>
          </div>
        )}

        {/* Action Section */}
        {record && (
          <div className="mt-4 pt-4 border-top">
            <h5 className="mb-3">Application Actions</h5>

            {service !== 'wwcc' && (
              <div className="alert alert-info">
                <FaEye className="me-2" />
                Review the application details above and take appropriate action.
              </div>
            )}

            {service === 'wwcc' && (
              <div className="mb-3">
                <label htmlFor="rejectionReason" className="form-label">
                  Rejection Reason (required if rejecting)
                </label>
                <textarea
                  id="rejectionReason"
                  className="form-control"
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="d-flex gap-2 flex-wrap">
              <button
                className={`btn ${styles.actionButton}`}
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck className="me-2" />
                    Approve Application
                  </>
                )}
              </button>

              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaTimes className="me-2" />
                    Reject Application
                  </>
                )}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/admin-applications/${service}`)}
                disabled={actionLoading}
              >
                <FaArrowLeft className="me-2" />
                Back to Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminViewApplication;
