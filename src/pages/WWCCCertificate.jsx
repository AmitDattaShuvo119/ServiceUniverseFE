import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaPrint, FaArrowLeft, FaCheckCircle, FaUser, FaCalendarAlt, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';

const WWCCCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      if (!token) {
        setError('You must be logged in to view WWCC certificates.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          throw new Error('WWCC certificate not found or access denied');
        }

        const data = await response.json();

        if (data.data && (data.data.approval_status || '').toLowerCase() === 'approved') {
          setCertificate(data.data);
        } else {
          throw new Error('WWCC certificate is not approved or accessible');
        }

      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.message || 'Failed to load WWCC certificate');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/services/wwcc-status');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading WWCC certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            <FaArrowLeft className="me-2" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Certificate Not Found</h4>
          <p>The requested WWCC certificate could not be found.</p>
          <button className="btn btn-primary" onClick={handleBack}>
            <FaArrowLeft className="me-2" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header Actions - Hidden when printing */}
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          Back to Applications
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <FaPrint className="me-2" />
          Print Certificate
        </button>
      </div>

      {/* WWCC Certificate */}
      <div className="wwcc-certificate-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        border: '3px solid #28a745',
        borderRadius: '15px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        fontFamily: 'Georgia, serif'
      }}>

        {/* Certificate Header */}
        <div className="text-center mb-4">
          <div style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <FaShieldAlt size={40} className="mb-2" />
            <h1 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              WORKING WITH CHILDREN CHECK
            </h1>
            <h3 className="mb-0" style={{ fontSize: '1.2rem' }}>
              Commonwealth of Australia
            </h3>
          </div>
        </div>

        {/* Certificate Number */}
        <div className="text-center mb-4">
          <div style={{
            backgroundColor: '#e9ecef',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'inline-block',
            border: '2px solid #28a745'
          }}>
            <strong style={{ fontSize: '1.1rem', color: '#28a745' }}>
              Certificate Number: {certificate.application_number}
            </strong>
          </div>
        </div>

        {/* Main Certificate Content */}
        <div className="certificate-content" style={{ lineHeight: '1.8' }}>

          <div className="row mb-4">
            <div className="col-12 text-center">
              <h3 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
                <FaUser className="me-2" />
                Applicant Information
              </h3>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Full Name:</strong>
              <div style={{
                fontSize: '1.3rem',
                color: '#28a745',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.first_name} {certificate.last_name}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Citizen ID:</strong>
              <div style={{
                fontSize: '1.1rem',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6',
                fontFamily: 'monospace'
              }}>
                <FaIdCard className="me-2" />
                {certificate.citizen_id}
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Date of Birth:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaCalendarAlt className="me-2" />
                {certificate.date_of_birth ? new Date(certificate.date_of_birth).toLocaleDateString('en-AU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Gender:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.gender || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <strong>Email:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.email}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Phone Number:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.phone_number}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <strong>Address:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaMapMarkerAlt className="me-2" />
                {certificate.address}
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h4 style={{ color: '#28a745', borderBottom: '1px solid #28a745', paddingBottom: '8px' }}>
                Certificate Details
              </h4>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Application Submitted:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.created_at ? new Date(certificate.created_at).toLocaleDateString('en-AU') : 'N/A'}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Certificate Approved:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaCheckCircle className="me-2 text-success" />
                {certificate.approval_date ? new Date(certificate.approval_date).toLocaleDateString('en-AU') : 'N/A'}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <strong>Approved By:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.approved_by || 'System Administrator'}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Valid Until:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.approval_date ? new Date(new Date(certificate.approval_date).getTime() + (5 * 365 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-AU') : 'N/A'}
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          {certificate.identity_documents && (
            <div className="row mb-4">
              <div className="col-12">
                <strong>Identity Documents Verified:</strong>
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  marginTop: '5px',
                  border: '1px solid #dee2e6'
                }}>
                  {certificate.identity_documents.split(',').map((doc, i) => (
                    <span key={i} className="badge bg-success me-2 mb-1">
                      Document {i + 1} Verified
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Certificate Footer */}
        <div className="text-center mt-5" style={{ borderTop: '2px solid #28a745', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '5px' }}>
            This is an official Working With Children Check certificate issued by the Commonwealth of Australia
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '5px' }}>
            This certificate confirms that the holder has been assessed as suitable to work with children.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            Certificate generated on {new Date().toLocaleDateString('en-AU')} at {new Date().toLocaleTimeString('en-AU')}
          </p>
        </div>

      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .wwcc-certificate-container {
            box-shadow: none !important;
            border: 3px solid #000 !important;
            margin: 0 !important;
            max-width: none !important;
            padding: 20px !important;
          }
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .container {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WWCCCertificate;