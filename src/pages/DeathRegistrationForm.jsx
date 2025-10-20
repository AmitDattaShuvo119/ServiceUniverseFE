import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import styles from './FormPage.module.css';

const DeathRegistrationForm = () => {
  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Register a Death</h1>
              <p className="text-muted">Please fill out the form below to apply for a death certificate.</p>
            </div>
            
            <Form>
              {/* Section 1: Deceased Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Deceased's Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Date of birth</Form.Label><Form.Control type="date" required /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Date of death</Form.Label><Form.Control type="date" required /></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Place of death (Hospital, Suburb, State)</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Cause of death (as per medical certificate)</Form.Label><Form.Control type="text" required /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 2: Informant Details (Applicant) */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">2. Informant's Details (Applicant)</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Relationship to deceased</Form.Label><Form.Control type="text" required /></Form.Group>
                   <Form.Group className="mb-3"><Form.Label>Residential address</Form.Label><Form.Control as="textarea" rows={3} required /></Form.Group>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Email address</Form.Label><Form.Control type="email" required /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Phone number</Form.Label><Form.Control type="tel" required /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Section 3: Supporting Documents */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">3. Supporting Documents</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Medical certificate of cause of death</Form.Label><Form.Control type="file" /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Proof of identity (informant)</Form.Label><Form.Control type="file" /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Deceased’s ID (if available)</Form.Label><Form.Control type="file" /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 4: Declaration */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">4. Declaration</Card.Header>
                <Card.Body>
                  <Form.Check type="checkbox" label="I confirm that the details provided are accurate." required />
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <Button variant="primary" type="submit" size="lg" className={styles.submitButton}>
                  Submit Registration
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

