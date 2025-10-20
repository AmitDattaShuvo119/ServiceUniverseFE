import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import styles from './FormPage.module.css';

const MarriageRegistrationForm = () => {
  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className={styles.formTitle}>Register a Marriage</h1>
              <p className="text-muted">Please fill out the form below to apply for a marriage certificate.</p>
            </div>
            
            <Form>
              {/* Section 1: Partner 1 Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Partner 1's Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Date of birth</Form.Label><Form.Control type="date" required /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Place of birth</Form.Label><Form.Control type="text" required /></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={3} required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Occupation</Form.Label><Form.Control type="text" required /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 2: Partner 2 Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">2. Partner 2's Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Date of birth</Form.Label><Form.Control type="date" required /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Place of birth</Form.Label><Form.Control type="text" required /></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={3} required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Occupation</Form.Label><Form.Control type="text" required /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 3: Marriage Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">3. Marriage Details</Card.Header>
                <Card.Body>
                   <Form.Group className="mb-3"><Form.Label>Date of marriage</Form.Label><Form.Control type="date" required /></Form.Group>
                   <Form.Group className="mb-3"><Form.Label>Place of marriage (Venue, City, State)</Form.Label><Form.Control type="text" required /></Form.Group>
                   <Form.Group className="mb-3"><Form.Label>Name of authorized celebrant</Form.Label><Form.Control type="text" required /></Form.Group>
                   <Form.Group className="mb-3"><Form.Label>Celebrant registration number (optional)</Form.Label><Form.Control type="text" /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 4: Supporting Documents */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">4. Supporting Documents</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Proof of identity (both partners)</Form.Label><Form.Control type="file" multiple /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Proof of residence</Form.Label><Form.Control type="file" /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Marriage certificate (if applying post-ceremony)</Form.Label><Form.Control type="file" /></Form.Group>
                </Card.Body>
              </Card>

              {/* Section 5: Declaration */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">5. Declaration</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3"><Form.Label>Digital signature (Partner 1)</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Digital signature (Partner 2)</Form.Label><Form.Control type="text" required /></Form.Group>
                  <Form.Check type="checkbox" label="We declare that the information provided is true and correct." required />
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

export default MarriageRegistrationForm;

