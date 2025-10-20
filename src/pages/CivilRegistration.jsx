import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBaby, FaBookDead, FaRing, FaArrowRight } from 'react-icons/fa';
import styles from '../pages/CivilRegistration.module.css';
import { Link } from 'react-router-dom';

const CivilRegistration = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <Container className="text-center text-white">
          <h1 className={styles.heroTitle}>Births, Relationships and Deaths</h1>
          <p className={styles.heroSubtitle}>
            Register important life events and order official certificates online.
          </p>
        </Container>
      </header>

      {/* Services Section */}
      <Container className="py-5">
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* Register a Birth Card */}
          <Col>
            <Card className={`${styles.serviceCard} h-100`}>
              <Card.Body className="text-center">
                <div className={styles.iconWrapper}>
                  <FaBaby />
                </div>
                <Card.Title as="h3" className="mt-3">Register a birth</Card.Title>
                <Card.Text className="text-muted">
                  Officially register the birth of your newborn. This is a crucial first step for your child's legal identity.
                </Card.Text>
                <Button as={Link} to="/services/birth-registration" variant="primary" className={`mt-3 ${styles.actionButton}`}>
                  Start application <FaArrowRight className="ms-2" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Register a Death Card */}
          <Col>
            <Card className={`${styles.serviceCard} h-100`}>
              <Card.Body className="text-center">
                <div className={styles.iconWrapper}>
                  <FaBookDead />
                </div>
                <Card.Title as="h3" className="mt-3">Register a death</Card.Title>
                <Card.Text className="text-muted">
                  Formally register the passing of a loved one to manage their estate and final arrangements.
                </Card.Text>
                <Button as={Link} to="/services/death-registration" variant="primary" className={`mt-3 ${styles.actionButton}`}>
                  Start application <FaArrowRight className="ms-2" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* Register a Marriage Card */}
          <Col>
            <Card className={`${styles.serviceCard} h-100`}>
              <Card.Body className="text-center">
                <div className={styles.iconWrapper}>
                  <FaRing />
                </div>
                <Card.Title as="h3" className="mt-3">Register a marriage</Card.Title>
                <Card.Text className="text-muted">
                  Apply for your official marriage certificate after your ceremony has taken place.
                </Card.Text>
                <Button as={Link} to="/services/marriage-registration" variant="primary" className={`mt-3 ${styles.actionButton}`}>
                  Start application <FaArrowRight className="ms-2" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default CivilRegistration;

