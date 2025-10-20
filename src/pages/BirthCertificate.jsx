import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPrint, FaArrowLeft, FaCertificate, FaBaby, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCheckCircle } from 'react-icons/fa';

const BirthCertificate = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      if (!token) {
        setError('You must be logged in to view birth certificates.');
        setLoading(false);
        return;
      }

      try {
        // First try to get from user summary, then fallback to direct certificate fetch
        const summaryResp = await fetch('http://localhost:3000/api/citizens/summary', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (summaryResp.ok) {
          const summaryData = await summaryResp.json();
          const birthRecords = Array.isArray(summaryData.data.birthRecords) ? summaryData.data.birthRecords : [];
          const cert = birthRecords.find(r => r.birth_certificate_number === certificateNumber);

          if (cert && (cert.approval_status || '').toLowerCase() === 'approved') {
            setCertificate(cert);
            setLoading(false);
            return;
          }
        }

        // If not found in summary or not approved, try direct fetch
        const certResp = await fetch(`http://localhost:3000/api/services/birthRecords/api/birth-records/certificate/${certificateNumber}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!certResp.ok) {
          throw new Error('Birth certificate not found or access denied');
        }

        const certData = await certResp.json();
        if (certData.data && (certData.data.approval_status || '').toLowerCase() === 'approved') {
          setCertificate(certData.data);
        } else {
          throw new Error('Birth certificate is not approved or accessible');
        }

      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.message || 'Failed to load birth certificate');
      } finally {
        setLoading(false);
      }
    };

    if (certificateNumber) {
      fetchCertificate();
    }
  }, [certificateNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/services/birth-status');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading birth certificate...</p>
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
          <p>The requested birth certificate could not be found.</p>
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

      {/* Birth Certificate */}
      <div className="birth-certificate-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        border: '3px solid #002664',
        borderRadius: '15px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        fontFamily: 'Georgia, serif'
      }}>

        {/* Certificate Header */}
        <div className="text-center mb-4">
          <div style={{
            backgroundColor: '#002664',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <FaCertificate size={40} className="mb-2" />
            <h1 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              BIRTH CERTIFICATE
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
            border: '2px solid #002664'
          }}>
            <strong style={{ fontSize: '1.1rem', color: '#002664' }}>
              Certificate Number: {certificate.birth_certificate_number}
            </strong>
          </div>
        </div>

        {/* Main Certificate Content */}
        <div className="certificate-content" style={{ lineHeight: '1.8' }}>

          <div className="row mb-4">
            <div className="col-12 text-center">
              <h3 style={{ color: '#002664', borderBottom: '2px solid #002664', paddingBottom: '10px' }}>
                <FaBaby className="me-2" />
                Child Information
              </h3>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Full Name:</strong>
              <div style={{
                fontSize: '1.3rem',
                color: '#002664',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.child_first_name} {certificate.child_last_name}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Date of Birth:</strong>
              <div style={{
                fontSize: '1.1rem',
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
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <strong>Place of Birth:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaMapMarkerAlt className="me-2" />
                {certificate.place_of_birth || 'Not specified'}
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

          {/* Parents Information */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h4 style={{ color: '#002664', borderBottom: '1px solid #002664', paddingBottom: '8px' }}>
                <FaUser className="me-2" />
                Parents Information
              </h4>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Mother's Name:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.mother_first_name} {certificate.mother_last_name}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Father's Name:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.father_first_name && certificate.father_last_name
                  ? `${certificate.father_first_name} ${certificate.father_last_name}`
                  : 'Not provided'
                }
              </div>
            </div>
          </div>

          

          {/* Certificate Details */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h4 style={{ color: '#002664', borderBottom: '1px solid #002664', paddingBottom: '8px' }}>
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
              <strong>Applied By:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.applied_by || 'N/A'}
              </div>
            </div>
          </div>

        </div>

        {/* Certificate Footer */}
        <div className="text-center mt-5" style={{ borderTop: '2px solid #002664', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '5px' }}>
            This is an official birth certificate issued by the Commonwealth of Australia
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
          .birth-certificate-container {
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

export default BirthCertificate;