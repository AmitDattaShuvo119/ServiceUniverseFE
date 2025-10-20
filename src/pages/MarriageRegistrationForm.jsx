import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './FormPage.module.css';

const MarriageRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Partner 1 details
    spouse1_first_name: '',
    spouse1_last_name: '',
    spouse1_middle_name: '',
    spouse1_maiden_name: '',
    spouse1_date_of_birth: '',
    spouse1_place_of_birth: '',
    spouse1_age_at_marriage: '',
    spouse1_previous_marriages: 0,
    spouse1_occupation: '',
    spouse1_father_name: '',
    spouse1_mother_name: '',
    spouse1_citizen_id: '',

    // Partner 2 details
    spouse2_first_name: '',
    spouse2_last_name: '',
    spouse2_middle_name: '',
    spouse2_maiden_name: '',
    spouse2_date_of_birth: '',
    spouse2_place_of_birth: '',
    spouse2_age_at_marriage: '',
    spouse2_previous_marriages: 0,
    spouse2_occupation: '',
    spouse2_father_name: '',
    spouse2_mother_name: '',
    spouse2_citizen_id: '',

    // Marriage details
    marriage_date: '',
    marriage_place: '',
    city: '',
    state_province: '',
    country: 'Australia',
    ceremony_type: 'civil',
    officiant_name: '',
    officiant_title: '',

    // Witnesses
    witness1_name: '',
    witness1_address: '',
    witness2_name: '',
    witness2_address: '',

    // Registrar
    registrar_name: '',
  });

  const [files, setFiles] = useState({
    marriage_certificate_scan: null,
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
    if (name === 'marriage_certificate_scan') {
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
        setError('You must be logged in to submit a marriage registration.');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });


      // Add files
      if (files.marriage_certificate_scan) {
        submitData.append('marriage_certificate_scan', files.marriage_certificate_scan);
      }

      files.supporting_documents.forEach((file) => {
        submitData.append('supporting_documents', file);
      });

      const response = await fetch('http://localhost:3000/api/services/marriageRecords/api/marriage-records', {
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
          navigate('/services/marriage-status');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit marriage registration');
      }
    } catch (err) {
      console.error('Error submitting marriage registration:', err);
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
              <p>Your marriage registration application has been submitted and is pending review.</p>
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
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Register a Marriage</h1>
              <p className="text-muted">Please fill out the form below to apply for a marriage certificate.</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Section 1: Partner 1 Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Partner 1's Details</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_first_name"
                          value={formData.spouse1_first_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_middle_name"
                          value={formData.spouse1_middle_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_last_name"
                          value={formData.spouse1_last_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Maiden Name (if applicable)</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_maiden_name"
                          value={formData.spouse1_maiden_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Citizen ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_citizen_id"
                          value={formData.spouse1_citizen_id}
                          onChange={handleChange}
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
                          name="spouse1_date_of_birth"
                          value={formData.spouse1_date_of_birth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Place of Birth *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_place_of_birth"
                          value={formData.spouse1_place_of_birth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age at Marriage</Form.Label>
                        <Form.Control
                          type="number"
                          name="spouse1_age_at_marriage"
                          value={formData.spouse1_age_at_marriage}
                          onChange={handleChange}
                          min="16"
                          max="100"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Previous Marriages</Form.Label>
                        <Form.Control
                          type="number"
                          name="spouse1_previous_marriages"
                          value={formData.spouse1_previous_marriages}
                          onChange={handleChange}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      type="text"
                      name="spouse1_occupation"
                      value={formData.spouse1_occupation}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Father's Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_father_name"
                          value={formData.spouse1_father_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mother's Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse1_mother_name"
                          value={formData.spouse1_mother_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Section 2: Partner 2 Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">2. Partner 2's Details</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_first_name"
                          value={formData.spouse2_first_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_middle_name"
                          value={formData.spouse2_middle_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_last_name"
                          value={formData.spouse2_last_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Maiden Name (if applicable)</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_maiden_name"
                          value={formData.spouse2_maiden_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Citizen ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_citizen_id"
                          value={formData.spouse2_citizen_id}
                          onChange={handleChange}
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
                          name="spouse2_date_of_birth"
                          value={formData.spouse2_date_of_birth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Place of Birth *</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_place_of_birth"
                          value={formData.spouse2_place_of_birth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age at Marriage</Form.Label>
                        <Form.Control
                          type="number"
                          name="spouse2_age_at_marriage"
                          value={formData.spouse2_age_at_marriage}
                          onChange={handleChange}
                          min="16"
                          max="100"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Previous Marriages</Form.Label>
                        <Form.Control
                          type="number"
                          name="spouse2_previous_marriages"
                          value={formData.spouse2_previous_marriages}
                          onChange={handleChange}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      type="text"
                      name="spouse2_occupation"
                      value={formData.spouse2_occupation}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Father's Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_father_name"
                          value={formData.spouse2_father_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mother's Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouse2_mother_name"
                          value={formData.spouse2_mother_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Section 3: Marriage Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">3. Marriage Details</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Marriage *</Form.Label>
                        <Form.Control
                          type="date"
                          name="marriage_date"
                          value={formData.marriage_date}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ceremony Type *</Form.Label>
                        <Form.Select
                          name="ceremony_type"
                          value={formData.ceremony_type}
                          onChange={handleChange}
                          required
                        >
                          <option value="civil">Civil</option>
                          <option value="religious">Religious</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Place of Marriage (Venue) *</Form.Label>
                    <Form.Control
                      type="text"
                      name="marriage_place"
                      value={formData.marriage_place}
                      onChange={handleChange}
                      placeholder="e.g., Registry Office, Church Name"
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
                        <Form.Label>Officiant Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="officiant_name"
                          value={formData.officiant_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Officiant Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="officiant_title"
                          value={formData.officiant_title}
                          onChange={handleChange}
                          placeholder="e.g., Marriage Celebrant, Minister"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Section 4: Witnesses */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">4. Witnesses</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Witness 1 Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="witness1_name"
                          value={formData.witness1_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Witness 1 Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="witness1_address"
                          value={formData.witness1_address}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Witness 2 Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="witness2_name"
                          value={formData.witness2_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Witness 2 Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="witness2_address"
                          value={formData.witness2_address}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Section 5: Registrar Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">5. Registrar Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Registrar Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrar_name"
                      value={formData.registrar_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 6: Supporting Documents */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">6. Supporting Documents</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Marriage Certificate Scan *</Form.Label>
                    <Form.Control
                      type="file"
                      name="marriage_certificate_scan"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <Form.Text className="text-muted">
                      Upload the marriage certificate (PDF, JPG, PNG)
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
                      Upload additional documents (ID proofs, affidavits, etc.) - PDF, JPG, PNG (max 10 files)
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 7: Declaration */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">7. Declaration</Card.Header>
                <Card.Body>
                  <Form.Check
                    type="checkbox"
                    label="We declare that all information provided is true and correct to the best of our knowledge, and that we are legally authorized to enter into this marriage."
                    required
                  />
                  <Form.Text className="text-muted">
                    By submitting this form, you certify that all information provided is true and correct.
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

export default MarriageRegistrationForm;

