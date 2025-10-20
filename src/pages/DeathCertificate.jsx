import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPrint, FaArrowLeft, FaCertificate, FaCross, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCheckCircle } from 'react-icons/fa';

const DeathCertificate = () => {
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
        setError('You must be logged in to view death certificates.');
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
          const deathRecords = Array.isArray(summaryData.data.deathRecords) ? summaryData.data.deathRecords : [];
          const cert = deathRecords.find(r => r.death_certificate_number === certificateNumber);

          if (cert && (cert.approval_status || '').toLowerCase() === 'approved') {
            setCertificate(cert);
            setLoading(false);
            return;
          }
        }

        // If not found in summary or not approved, try direct fetch
        const certResp = await fetch(`http://localhost:3000/api/services/deathRecords/api/death-records/${certificateNumber}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!certResp.ok) {
          throw new Error('Death certificate not found or access denied');
        }

        const certData = await certResp.json();
        if (certData.success && (certData.data.approval_status || '').toLowerCase() === 'approved') {
          setCertificate(certData.data);
        } else {
          throw new Error('Certificate not approved or not found');
        }
      } catch (err) {
        console.error('Error fetching death certificate:', err);
        setError(err.message || 'Failed to load death certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateNumber]);

  const handleBack = () => {
    navigate('/services/death-status');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Death Certificate...</h4>
          <p>Please wait while we retrieve your certificate.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Certificate</h4>
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
          <p>The requested death certificate could not be found.</p>
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

      {/* Death Certificate */}
      <div className="death-certificate-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        border: '3px solid #dc3545',
        borderRadius: '15px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        fontFamily: 'Georgia, serif'
      }}>

        {/* Certificate Header */}
        <div className="text-center mb-4">
          <div style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <FaCertificate size={40} className="mb-2" />
            <h1 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              DEATH CERTIFICATE
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
            border: '2px solid #dc3545'
          }}>
            <strong style={{ fontSize: '1.1rem', color: '#dc3545' }}>
              Certificate Number: {certificate.death_certificate_number}
            </strong>
          </div>
        </div>

        {/* Main Certificate Content */}
        <div className="certificate-content" style={{ lineHeight: '1.8' }}>

          <div className="row mb-4">
            <div className="col-12 text-center">
              <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>
                <FaCross className="me-2" />
                Deceased Information
              </h3>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Full Name:</strong>
              <div style={{
                fontSize: '1.3rem',
                color: '#dc3545',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.deceased_first_name} {certificate.deceased_last_name}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Date of Death:</strong>
              <div style={{
                fontSize: '1.1rem',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaCalendarAlt className="me-2" />
                {certificate.date_of_death ? new Date(certificate.date_of_death).toLocaleDateString('en-AU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Place of Death:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                <FaMapMarkerAlt className="me-2" />
                {certificate.place_of_death || 'Not specified'}
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
              <strong>Cause of Death:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6',
                minHeight: '60px'
              }}>
                {certificate.cause_of_death || 'Not specified'}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Age at Death:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.age_at_death ? `${certificate.age_at_death} years` : 'Not calculated'}
              </div>
            </div>
          </div>

          {/* Informant Information */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h4 style={{ color: '#dc3545', borderBottom: '1px solid #dc3545', paddingBottom: '5px' }}>
                <FaUser className="me-2" />
                Informant Information
              </h4>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Informant Name:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.informant_name || 'Not specified'}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Relationship:</strong>
              <div style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginTop: '5px',
                border: '1px solid #dee2e6'
              }}>
                {certificate.informant_relationship || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="row mt-5">
            <div className="col-12 text-center">
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid #dc3545'
              }}>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Registrar:</strong>
                    <div style={{ marginTop: '5px', color: '#dc3545' }}>
                      {certificate.registrar_name || 'Not specified'}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <strong>Issue Date:</strong>
                    <div style={{ marginTop: '5px' }}>
                      {certificate.approval_date ? new Date(certificate.approval_date).toLocaleDateString('en-AU') : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Seal */}
          <div className="row mt-4">
            <div className="col-12 text-center">
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '15px',
                borderRadius: '50%',
                display: 'inline-block',
                width: '120px',
                height: '120px',
                lineHeight: '90px',
                textAlign: 'center',
                border: '5px solid #f8f9fa'
              }}>
                <FaCheckCircle size={40} />
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  OFFICIAL
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Validation */}
          <div className="row mt-3">
            <div className="col-12 text-center">
              <small style={{ color: '#6c757d' }}>
                This certificate is issued under the authority of the Registry of Births, Deaths and Marriages.
                Certificate Number: {certificate.death_certificate_number}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .death-certificate-container {
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DeathCertificate;