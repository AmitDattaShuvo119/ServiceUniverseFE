import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaDownload, FaCertificate, FaSyringe, FaCalendarAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import styles from './FormPage.module.css';

const VaccinationCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]); // certificateId is the only external dependency

  const fetchCertificate = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.token;

    if (!token) {
      setError('You must be logged in to view certificates.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/services/certificateGeneration/api/certificates/${certificateId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }

      const data = await response.json();
      console.log(data.data)
      data.data.vaccination_details=JSON.parse(data.data.vaccination_details)
      setCertificateData(data.data);
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setError(err.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real application, this would trigger a PDF download
    // For now, we'll just print the certificate
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <h4 className="mt-3">Loading Certificate...</h4>
            <p>Please wait while we retrieve your vaccination certificate.</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Container>
          <Alert variant="danger" className="text-center">
            <h4>Error Loading Certificate</h4>
            <p>{error}</p>
            <Button variant="primary" onClick={fetchCertificate}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className={styles.pageContainer}>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Certificate Not Found</h4>
            <p>The requested certificate could not be found.</p>
            <Button variant="primary" onClick={() => navigate('/services/vaccination-records')}>
              Back to Records
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/services/vaccination-records')}
              >
                <FaArrowLeft className="me-2" />
                Back to Records
              </Button>
              <Button variant="success" onClick={handleDownload}>
                <FaDownload className="me-2" />
                Download PDF
              </Button>
            </div>

            {/* Certificate */}
            <Card className="border-0 shadow-lg" id="certificate">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-3">
                    <FaShieldAlt size={48} className="text-primary" />
                  </div>
                  <h1 className="display-5 fw-bold text-primary mb-2">ServiceUniverse</h1>
                  <h2 className="h3 text-muted mb-4">Vaccination Certificate</h2>
                  <div className="border-bottom border-primary mx-auto" style={{width: '200px'}}></div>
                </div>

                {/* Certificate ID */}
                <div className="text-center mb-4">
                  <h5 className="text-muted">Certificate ID</h5>
                  <h4 className="fw-bold text-primary">{certificateData.certificate_id}</h4>
                </div>

                {/* Citizen Information */}
                <Card className="mb-4 border-primary">
                  <Card.Header className="bg-primary text-white">
                    <FaUserMd className="me-2" />
                    Citizen Information
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <strong>Full Name:</strong><br />
                        {certificateData.citizen?.first_name} {certificateData.citizen?.last_name}
                      </Col>
                      <Col md={6}>
                        <strong>Citizen ID:</strong><br />
                        {certificateData.citizen?.citizen_id}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Vaccination Records */}
                <Card className="mb-4 border-success">
                  <Card.Header className="bg-success text-white">
                    <FaSyringe className="me-2" />
                    Vaccination Records
                  </Card.Header>
                  <Card.Body>
                    {certificateData.vaccination_details && certificateData.vaccination_details.length > 0 ? (
                      <Row>
                        {certificateData.vaccination_details.map((vaccination, index) => (
                          <Col md={6} key={index} className="mb-3">
                            <Card className="h-100">
                              <Card.Body>
                                <h6 className="fw-bold text-success mb-2">{vaccination.vaccine_name}</h6>
                                <div className="small">
                                  <p className="mb-1">
                                    <FaCalendarAlt className="me-1" />
                                    <strong>Date:</strong> {new Date(vaccination.vaccination_date).toLocaleDateString()}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Dose:</strong> {vaccination.dose_number}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Batch:</strong> {vaccination.batch_number}
                                  </p>
                                  {vaccination.provider_name && (
                                    <p className="mb-1">
                                      <strong>Provider:</strong> {vaccination.provider_name}
                                    </p>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p className="text-muted text-center">No vaccination records found for this certificate.</p>
                    )}
                  </Card.Body>
                </Card>

                {/* Certificate Details */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Card>
                      <Card.Body className="text-center">
                        <h6 className="text-muted">Issue Date</h6>
                        <h5 className="fw-bold">{new Date(certificateData.issue_date).toLocaleDateString()}</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Body className="text-center">
                        <h6 className="text-muted">Valid Until</h6>
                        <h5 className="fw-bold">{new Date(certificateData.expiry_date).toLocaleDateString()}</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Footer */}
                <div className="text-center mt-5">
                  <div className="border-top border-primary pt-4">
                    <p className="mb-2">
                      <strong>Issued by:</strong> ServiceUniverse Health Authority
                    </p>
                    <p className="mb-2">
                      <strong>Certificate Status:</strong>
                      <span className={`badge ms-2 ${certificateData.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {certificateData.status?.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-muted small">
                      This certificate is valid for 12 months from the issue date and serves as official proof of vaccination status.
                    </p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                {certificateData.qr_code && (
                  <div className="text-center mt-4">
                    <div className="border p-3 d-inline-block">
                      <small className="text-muted">QR Code for Verification</small>
                      <div className="mt-2">
                        <img
                          src={`data:image/png;base64,${certificateData.qr_code}`}
                          alt="QR Code"
                          style={{maxWidth: '100px', maxHeight: '100px'}}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .btn, .alert, .d-flex {
            display: none !important;
          }
          #certificate {
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VaccinationCertificate;