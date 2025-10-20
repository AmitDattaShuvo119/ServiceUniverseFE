import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { FaEye, FaCertificate, FaCheckCircle, FaSyringe, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import styles from './FormPage.module.css';

const VaccinationRecords = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vaccinationData, setVaccinationData] = useState(null);
  const [selectedVaccinations, setSelectedVaccinations] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [certificateResult, setCertificateResult] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [certsError, setCertsError] = useState('');

  // intentionally run once on mount; fetchVaccinationRecords is stable for our use
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchVaccinationRecords = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.token;
    const citizenId = storedUser?.citizen_id;

    if (!token) {
      setError('You must be logged in to view vaccination records.');
      setLoading(false);
      return;
    }

    if (!citizenId) {
      setError('Citizen ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Fetch citizen info and vaccination records
      const [citizenResponse, recordsResponse] = await Promise.all([
        fetch(`http://localhost:3000/api/services/citizens-auth/api/citizens/${citizenId}`),
        fetch(`http://localhost:3000/api/services/vaccinationRecords/api/vaccination-records/${citizenId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!recordsResponse.ok) {
        throw new Error('Failed to fetch vaccination records');
      }
      
      const recordsData = await recordsResponse.json();
      console.log(recordsData)
      const citizenData = citizenResponse.ok ? await citizenResponse.json() : storedUser;

      // Structure data to match component expectations
      const structuredData = {
        citizen: citizenData ? {
          first_name: citizenData.first_name,
          last_name: citizenData.last_name,
          citizen_id: citizenData.citizen_id
        } : {
          first_name: 'Unknown',
          last_name: 'Citizen',
          citizen_id: citizenId
        },
        vaccination_records: recordsData.data || [],
        vaccination_summary: [] // Will be computed from records
      };

      // Create vaccination summary from records
      const vaccineGroups = {};
      structuredData.vaccination_records.forEach(record => {
        if (!vaccineGroups[record.vaccine_id]) {
          vaccineGroups[record.vaccine_id] = {
            vaccine_name: record.vaccine_name,
            manufacturer: record.manufacturer,
            doses_received: 0,
            doses_required: record.doses_required || 1,
            is_complete: false
          };
        }
        vaccineGroups[record.vaccine_id].doses_received++;
      });

      structuredData.vaccination_summary = Object.values(vaccineGroups).map(vaccine => ({
        ...vaccine,
        is_complete: vaccine.doses_received >= vaccine.doses_required
      }));

      setVaccinationData(structuredData);
      // after loading vaccination data, fetch previously generated certificates
      try {
        await fetchCertificates(citizenId);
      } catch (err) {
        // ignore here, fetchCertificates will set its own error
        console.debug('Ignored certificates fetch error', err);
      }
    } catch (err) {
      console.error('Error fetching vaccination records:', err);
      setError(err.message || 'Failed to load vaccination records');
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchVaccinationRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCertificates = async (citizenIdParam) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.token;
    const citizenId = citizenIdParam || storedUser?.citizen_id;

    if (!token || !citizenId) return;

    setCertsLoading(true);
    setCertsError('');
    try {
      const res = await fetch(`http://localhost:3000/api/services/certificateGeneration/api/certificates/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch certificates');
      }

      const body = await res.json();
      setCertificates(body.data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setCertsError(err.message || 'Failed to load certificates');
    } finally {
      setCertsLoading(false);
    }
  };

  const downloadCertificateJSON = async (certificateId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.token;
    if (!token) return setCertsError('Authentication required to download');

    try {
      const res = await fetch(`http://localhost:3000/api/services/certificateGeneration/api/certificates/${certificateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch certificate');
      const body = await res.json();
      const blob = new Blob([JSON.stringify(body.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certificateId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setCertsError(err.message || 'Failed to download certificate');
    }
  };

  const handleVaccinationSelect = (vaccinationId, isSelected) => {
    if (isSelected) {
      setSelectedVaccinations(prev => [...prev, vaccinationId]);
    } else {
      setSelectedVaccinations(prev => prev.filter(id => id !== vaccinationId));
    }
  };

  const handleSelectAll = () => {
    if (vaccinationData?.vaccination_records) {
      const allIds = vaccinationData.vaccination_records.map(record => record.id);
      setSelectedVaccinations(allIds);
    }
  };

  const handleDeselectAll = () => {
    setSelectedVaccinations([]);
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    setCertificateResult(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      const requestBody = {
        vaccination_record_ids: selectedVaccinations.length > 0 ? selectedVaccinations : undefined
      };

      const response = await fetch('http://localhost:3000/api/services/certificateGeneration/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok) {
        setCertificateResult({ success: true, data: result.data });
      } else {
        setCertificateResult({ success: false, error: result.error });
      }
    } catch (err) {
      console.error('Error generating certificate:', err);
      setCertificateResult({ success: false, error: 'Failed to generate certificate' });
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const handleViewCertificate = (certificateId) => {
    navigate(`/services/vaccination-certificate/${certificateId}`);
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <h4 className="mt-3">Loading Vaccination Records...</h4>
            <p>Please wait while we retrieve your vaccination history.</p>
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
            <h4>Error Loading Records</h4>
            <p>{error}</p>
            <Button variant="primary" onClick={fetchVaccinationRecords}>
              Try Again
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
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>My Vaccination Records</h1>
              <p className="text-muted">View your complete immunisation history and generate vaccination certificates.</p>
            </div>

            {vaccinationData?.citizen && (
              <Card className={`${styles.sectionCard} mb-4`}>
                <Card.Header as="h5">
                  <FaUserMd className="me-2" />
                  Citizen Information
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <strong>Name:</strong> {vaccinationData.citizen.first_name} {vaccinationData.citizen.last_name}
                    </Col>
                    <Col md={6}>
                      <strong>Citizen ID:</strong> {vaccinationData.citizen.citizen_id}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Vaccination Summary */}
            {vaccinationData?.vaccination_summary && vaccinationData.vaccination_summary.length > 0 && (
              <Card className={`${styles.sectionCard} mb-4`}>
                <Card.Header as="h5">
                  <FaCheckCircle className="me-2" />
                  Vaccination Summary
                </Card.Header>
                <Card.Body>
                  <Row>
                    {vaccinationData.vaccination_summary.map((vaccine, index) => (
                      <Col md={6} lg={4} key={index} className="mb-3">
                        <div className={`p-3 rounded ${vaccine.is_complete ? 'bg-success bg-opacity-10 border border-success' : 'bg-warning bg-opacity-10 border border-warning'}`}>
                          <h6 className="mb-2">{vaccine.vaccine_name}</h6>
                          <div className="d-flex justify-content-between">
                            <small>Doses: {vaccine.doses_received}/{vaccine.total_doses_required}</small>
                            {vaccine.is_complete && <FaCheckCircle className="text-success" />}
                          </div>
                          {vaccine.next_due_date && (
                            <small className="text-muted d-block">
                              Next due: {new Date(vaccine.next_due_date).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Individual Vaccination Records */}
            {vaccinationData?.vaccination_records && vaccinationData.vaccination_records.length > 0 && (
              <Card className={styles.sectionCard}>
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                  <span>
                    <FaSyringe className="me-2" />
                    Detailed Vaccination Records
                  </span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSelectAll}
                      className="me-2"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Deselect All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <p className="text-muted">
                      Select the vaccinations you want to include in your certificate. If none are selected, all completed vaccinations will be included.
                    </p>
                  </div>

                  <Row>
                    {vaccinationData.vaccination_records.map((record) => (
                      <Col md={6} lg={4} key={record.id} className="mb-3">
                        <Card className={`h-100 ${selectedVaccinations.includes(record.id) ? 'border-primary' : ''}`}>
                          <Card.Body className="d-flex flex-column">
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`vaccine-${record.id}`}
                                checked={selectedVaccinations.includes(record.id)}
                                onChange={(e) => handleVaccinationSelect(record.id, e.target.checked)}
                              />
                              <label className="form-check-label fw-bold" htmlFor={`vaccine-${record.id}`}>
                                {record.vaccine_name}
                              </label>
                            </div>

                            <div className="flex-grow-1">
                              <p className="card-text mb-1">
                                <FaCalendarAlt className="me-1" />
                                <strong>Date:</strong> {new Date(record.vaccination_date).toLocaleDateString()}
                              </p>
                              <p className="card-text mb-1">
                                <strong>Dose:</strong> {record.dose_number}
                              </p>
                              <p className="card-text mb-1">
                                <strong>Batch:</strong> {record.batch_number}
                              </p>
                              {record.provider_name && (
                                <p className="card-text mb-1">
                                  <strong>Provider:</strong> {record.provider_name}
                                </p>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <div className="text-center mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => setShowCertificateModal(true)}
                      disabled={selectedVaccinations.length === 0 && (!vaccinationData.vaccination_summary || !vaccinationData.vaccination_summary.some(v => v.is_complete))}
                    >
                      <FaCertificate className="me-2" />
                      Generate Vaccination Certificate
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {(!vaccinationData?.vaccination_records || vaccinationData.vaccination_records.length === 0) && (
              <Card className={styles.sectionCard}>
                <Card.Body className="text-center">
                  <FaSyringe size={48} className="text-muted mb-3" />
                  <h5>No Vaccination Records Found</h5>
                  <p>Vaccination records are managed by authorized healthcare providers.</p>
                  <p className="text-muted">Please contact your healthcare provider to add or update your vaccination records.</p>
                </Card.Body>
              </Card>
            )}

            {/* Previously generated certificates */}
            <Card className={`${styles.sectionCard} mt-4`}>
              <Card.Header as="h5">
                <FaCertificate className="me-2" />
                Previously generated certificates
              </Card.Header>
              <Card.Body>
                {certsLoading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" />
                  </div>
                ) : certsError ? (
                  <Alert variant="danger">{certsError}</Alert>
                ) : certificates.length === 0 ? (
                  <p className="text-muted">No certificates have been generated yet.</p>
                ) : (
                  <Row>
                    {certificates.map((cert) => (
                      <Col md={6} lg={4} key={cert.certificate_id} className="mb-3">
                        <Card className="h-100">
                          <Card.Body className="d-flex flex-column">
                            <h6 className="mb-2">{cert.citizen_name || cert.citizen_id}</h6>
                            <p className="text-muted mb-2">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                            <p className="text-muted mb-2">Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                            <div className="mt-auto d-flex gap-2">
                              <Button variant="outline-primary" size="sm" onClick={() => handleViewCertificate(cert.certificate_id)}>
                                <FaEye className="me-1" /> View
                              </Button>
                              <Button variant="outline-secondary" size="sm" onClick={() => downloadCertificateJSON(cert.certificate_id)}>
                                Download JSON
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Certificate Generation Modal */}
      <Modal show={showCertificateModal} onHide={() => setShowCertificateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCertificate className="me-2" />
            Generate Vaccination Certificate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6>Certificate Details:</h6>
            <p className="mb-2">
              <strong>Vaccinations to include:</strong>{' '}
              {selectedVaccinations.length > 0
                ? `${selectedVaccinations.length} selected vaccination${selectedVaccinations.length > 1 ? 's' : ''}`
                : 'All completed vaccinations'
              }
            </p>
            <p className="mb-2">
              <strong>Issuer:</strong> ServiceUniverse Health Authority
            </p>
            <p className="mb-0">
              <strong>Valid for:</strong> 12 months from issue date
            </p>
          </div>

          {certificateResult && (
            <Alert variant={certificateResult.success ? 'success' : 'danger'}>
              {certificateResult.success ? (
                <div>
                  <h6>Certificate Generated Successfully!</h6>
                  <p>Certificate ID: {certificateResult.data.certificate_id}</p>
                  <Button
                    variant="primary"
                    onClick={() => handleViewCertificate(certificateResult.data.certificate_id)}
                  >
                    <FaEye className="me-2" />
                    View Certificate
                  </Button>
                </div>
              ) : (
                <div>
                  <h6>Certificate Generation Failed</h6>
                  <p>{certificateResult.error}</p>
                </div>
              )}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCertificateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleGenerateCertificate}
            disabled={generatingCertificate}
          >
            {generatingCertificate ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <FaCertificate className="me-2" />
                Generate Certificate
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VaccinationRecords;