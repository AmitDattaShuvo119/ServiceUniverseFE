import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import styles from './FormPage.module.css';

const AddVaccinationRecord = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [citizens, setCitizens] = useState([]);
  const [citizensLoading, setCitizensLoading] = useState(false);
  const [citizenSearch, setCitizenSearch] = useState('');
  const [showCitizenDropdown, setShowCitizenDropdown] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [vaccinesLoading, setVaccinesLoading] = useState(false);
  const [formData, setFormData] = useState({
    citizen_id: '',
    vaccine_id: '',
    dose_number: '',
    vaccination_date: '',
    batch_number: '',
    healthcare_provider: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    if (!adminData.token) {
      navigate('/admin-login');
      return;
    }

    // Load initial citizens
    fetchCitizens();

    // Load vaccines
    fetchVaccines();

    // Add click outside handler
    const handleClickOutside = (event) => {
      if (!event.target.closest('.position-relative')) {
        setShowCitizenDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [navigate]);

  const fetchVaccines = async () => {
    setVaccinesLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/services/vaccinationRecords/api/vaccines');
      if (response.ok) {
        const result = await response.json();
        setVaccines(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching vaccines:', error);
    } finally {
      setVaccinesLoading(false);
    }
  };

  const fetchCitizens = async (search = '') => {
    setCitizensLoading(true);
    try {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      const response = await fetch(`http://localhost:3000/api/citizens?search=${encodeURIComponent(search)}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${adminData.token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCitizens(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching citizens:', error);
    } finally {
      setCitizensLoading(false);
    }
  };

  const handleCitizenSearch = (e) => {
    const value = e.target.value;
    setCitizenSearch(value);
    setShowCitizenDropdown(true);

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchCitizens(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const selectCitizen = (citizen) => {
    setSelectedCitizen(citizen);
    setFormData(prev => ({
      ...prev,
      citizen_id: citizen.citizen_id
    }));
    setCitizenSearch(`${citizen.first_name} ${citizen.last_name} (${citizen.email})`);
    setShowCitizenDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dose_number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      if (!adminData.token) {
        setError('Admin authentication required');
        return;
      }

      const submitData = {
        ...formData,
        vaccine_id: formData.vaccine_id && formData.vaccine_id !== '' ? Number(formData.vaccine_id) : undefined,
        dose_number: formData.dose_number && formData.dose_number !== '' ? Number(formData.dose_number) : undefined
      };

      // Remove undefined values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('Submitting data:', submitData); // Debug log

      const response = await fetch('http://localhost:3000/api/services/vaccinationRecords/api/vaccination-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Vaccination record added successfully!');
        // Reset form
        setFormData({
          citizen_id: '',
          vaccine_id: 0,
          dose_number: '',
          vaccination_date: '',
          batch_number: '',
          healthcare_provider: '',
          location: '',
          notes: ''
        });
        setSelectedCitizen(null);
        setCitizenSearch('');
      } else {
        setError(result.error || 'Failed to add vaccination record');
      }
    } catch (err) {
      console.error('Error adding vaccination record:', err);
      setError('Failed to add vaccination record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Add Vaccination Record</h1>
              <p className="text-muted">Enter the details below to add a new vaccination record to a citizen's immunization history.</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-4">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">Vaccination Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Citizen</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        value={citizenSearch}
                        onChange={handleCitizenSearch}
                        onFocus={() => setShowCitizenDropdown(true)}
                        placeholder="Search by name or email..."
                        required
                      />
                      {citizensLoading && (
                        <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                          <Spinner animation="border" size="sm" />
                        </div>
                      )}
                      {showCitizenDropdown && citizens.length > 0 && (
                        <ListGroup className="position-absolute w-100 mt-1" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                          {citizens.map((citizen) => (
                            <ListGroup.Item
                              key={citizen.citizen_id}
                              action
                              onClick={() => selectCitizen(citizen)}
                              className="py-2"
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{citizen.first_name} {citizen.last_name}</strong>
                                  <br />
                                  <small className="text-muted">{citizen.email}</small>
                                </div>
                                <small className="text-muted">{citizen.citizen_id}</small>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </div>
                    {selectedCitizen && (
                      <Form.Text className="text-success">
                        Selected: {selectedCitizen.first_name} {selectedCitizen.last_name} ({selectedCitizen.citizen_id})
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Vaccine</Form.Label>
                        <Form.Select
                          name="vaccine_id"
                          value={formData.vaccine_id}
                          onChange={handleInputChange}
                          required
                          disabled={vaccinesLoading}
                        >
                          <option value="">Select a vaccine...</option>
                          {vaccines.map((vaccine) => (
                            <option key={vaccine.id} value={vaccine.id}>
                              {vaccine.vaccine_name} - {vaccine.manufacturer}
                            </option>
                          ))}
                        </Form.Select>
                        {vaccinesLoading && (
                          <Form.Text className="text-muted">
                            Loading vaccines...
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dose Number</Form.Label>
                        <Form.Control
                          type="number"
                          name="dose_number"
                          value={formData.dose_number}
                          onChange={handleInputChange}
                          placeholder="e.g., 1"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Vaccination Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="vaccination_date"
                      value={formData.vaccination_date}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Batch Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="batch_number"
                      value={formData.batch_number}
                      onChange={handleInputChange}
                      placeholder="e.g., FLU2024-ABC"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Healthcare Provider</Form.Label>
                    <Form.Control
                      type="text"
                      name="healthcare_provider"
                      value={formData.healthcare_provider}
                      onChange={handleInputChange}
                      placeholder="e.g., Community Pharmacy"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., 456 Oak Avenue, Downtown"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g., Annual influenza vaccine administered."
                    />
                  </Form.Group>
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
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Adding Record...
                    </>
                  ) : (
                    'Add Record'
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddVaccinationRecord;

