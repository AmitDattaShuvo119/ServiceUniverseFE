import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import styles from './FormPage.module.css';

const AddVaccinationRecord = () => {
  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Add a Vaccination Record</h1>
              <p className="text-muted">Enter the details below to add a new vaccination to a citizen's record.</p>
            </div>
            
            <Form>
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">Vaccination Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Citizen ID</Form.Label>
                    <Form.Control type="text" placeholder="e.g., CIT17607868624079I1ZVEFGQ" required />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Vaccine ID</Form.Label>
                        <Form.Control type="number" placeholder="e.g., 4" required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dose Number</Form.Label>
                        <Form.Control type="number" placeholder="e.g., 1" required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Vaccination Date</Form.Label>
                    <Form.Control type="date" required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Batch Number</Form.Label>
                    <Form.Control type="text" placeholder="e.g., FLU2024-ABC" required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Healthcare Provider</Form.Label>
                    <Form.Control type="text" placeholder="e.g., Community Pharmacy" required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" placeholder="e.g., 456 Oak Avenue, Downtown" required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Notes (Optional)</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="e.g., Annual influenza vaccine administered." />
                  </Form.Group>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <Button variant="primary" type="submit" size="lg" className={styles.submitButton}>
                  Add Record
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

