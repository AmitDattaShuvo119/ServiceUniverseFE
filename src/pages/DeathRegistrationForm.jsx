import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './FormPage.module.css';

const DeathRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deceased_first_name: '',
    deceased_last_name: '',
    date_of_birth: '',
    date_of_death: '',
    place_of_death: '',
    city: '',
    state_province: '',
    country: 'Australia',
    gender: '',
    cause_of_death: '',
    informant_name: '',
    informant_relationship: '',
    registrar_name: '',
  });

  const [files, setFiles] = useState({
    death_certificate_scan: null,
    supporting_documents: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === 'death_certificate_scan') {
      setFiles({ ...files, [name]: selectedFiles[0] });
    } else if (name === 'supporting_documents') {
      setFiles({ ...files, [name]: Array.from(selectedFiles) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      if (!token) {
        setError('You must be logged in to submit a death registration.');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

     

      // Add files
      if (files.death_certificate_scan) {
        submitData.append('death_certificate_scan', files.death_certificate_scan);
      }

      files.supporting_documents.forEach((file) => {
        submitData.append('supporting_documents', file);
      });

      const response = await fetch('http://localhost:3000/api/services/deathRecords/api/death-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/services/death-status');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit death registration');
      }
    } catch (err) {
      console.error('Error submitting death registration:', err);
      setError('An error occurred while submitting the registration');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            <Alert variant="success" className="text-center">
              <h4>Registration Submitted Successfully!</h4>
              <p>Your death registration application has been submitted and is pending review.</p>
              <p>You will be redirected to the status page shortly...</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Register a Death</h1>
              <p className="text-muted">Please fill out the form below to apply for a death certificate.</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Section 1: Deceased Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Deceased's Details</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="deceased_first_name"
                          value={formData.deceased_first_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="deceased_last_name"
                          value={formData.deceased_last_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Death *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_death"
                          value={formData.date_of_death}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Place of Death *</Form.Label>
                    <Form.Control
                      type="text"
                      name="place_of_death"
                      value={formData.place_of_death}
                      onChange={handleChange}
                      placeholder="Hospital, home, or other location"
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>State/Province *</Form.Label>
                        <Form.Control
                          type="text"
                          name="state_province"
                          value={formData.state_province}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country *</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender *</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Registrar Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="registrar_name"
                          value={formData.registrar_name}
                          onChange={handleChange}
                          placeholder="Name of the registrar"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Cause of Death *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="cause_of_death"
                      value={formData.cause_of_death}
                      onChange={handleChange}
                      placeholder="As per medical certificate"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 2: Informant Details (Applicant) */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">2. Informant's Details (Applicant)</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="informant_name"
                          value={formData.informant_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Relationship to Deceased *</Form.Label>
                        <Form.Control
                          type="text"
                          name="informant_relationship"
                          value={formData.informant_relationship}
                          onChange={handleChange}
                          placeholder="e.g., Spouse, Child, Parent"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                </Card.Body>
              </Card>

              {/* Section 3: Supporting Documents */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">3. Supporting Documents</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Medical Certificate of Cause of Death *</Form.Label>
                    <Form.Control
                      type="file"
                      name="death_certificate_scan"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <Form.Text className="text-muted">
                      Upload the medical certificate (PDF, JPG, PNG)
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Additional Supporting Documents</Form.Label>
                    <Form.Control
                      type="file"
                      name="supporting_documents"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                    />
                    <Form.Text className="text-muted">
                      Upload additional documents (ID, proof of relationship, etc.) - PDF, JPG, PNG (max 10 files)
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 4: Declaration */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">4. Declaration</Card.Header>
                <Card.Body>
                  <Form.Check
                    type="checkbox"
                    label="I confirm that the details provided are accurate and I am authorized to apply for this death certificate."
                    required
                  />
                  <Form.Text className="text-muted">
                    By submitting this form, you certify that all information provided is true and correct to the best of your knowledge.
                  </Form.Text>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeathRegistrationForm;
