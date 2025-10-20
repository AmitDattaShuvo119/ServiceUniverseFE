import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaUserEdit, FaSyringe, FaCalculator, FaShieldAlt, FaMobileAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './landing.module.css';
import ServiceCard from '../components/ServiceCard'; 
import SydneyImage from "../assets/images/sydney.jpg";

const LandingPage = () => {
  const popularServices = [
    {
      icon: <FaUserEdit />,
      title: "Civil Registration",
      text: "Register birth, death & marriage, download certificates.",
      link: "/services/births-deaths-marriages" 
    },
    {
      icon: <FaSyringe />,
      title: "Vaccination Records",
      text: "View and download your immunization history.",
      link: "/services/vaccination-records"
    },
    {
      icon: <FaCalculator />,
      title: "Working With Children Check",
      text: "Apply for, renew, or check the status of your clearance.",
      link: "/services/wwcc"
    }
  ];

  return (
    <div className={styles.pageWrapper}>

      {/* Main Content */}
      <main>
        {/* 1. Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <Container className={`${styles.heroContent} text-center`}>
            <h1 className={`${styles.heroTitle} display-3 fw-bold`}>
              Your Gateway to Digital Government Services
            </h1>
            <p className={`${styles.heroSubtitle} lead my-4`}>
              Access civil registration, vaccination records, tax services, and more with unparalleled ease and security.
            </p>
          </Container>
        </header>

        <Container as="main" className={styles.mainContent}>
          {/* 2. Services Section */}
        <section id="services" className="py-1">
          <h2 className="text-center display-5 mb-5">Popular Services</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {popularServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                text={service.text}
                link={service.link}
              />
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/services" variant="primary" size="lg" className={styles.animatedButton}>
              Browse All Services <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </section>

          {/* 3. Key Features Section */}
          <section id="features" className={`py-5 ${styles.featuresSection}`}>
             <h2 className="text-center display-5 mb-5 fw-bold">A Platform You Can Trust</h2>
             <Row>
               <Col md={4} className="text-center p-3">
                 <div className={styles.featureIconWrapper}>
                   <FaShieldAlt />
                 </div>
                 <h4 className="mt-3 fw-bold">Secure & Private</h4>
                 <p className="text-muted">Your data is protected with the highest security standards.</p>
               </Col>
               <Col md={4} className="text-center p-3">
                 <div className={styles.featureIconWrapper}>
                   <FaClock />
                 </div>
                 <h4 className="mt-3 fw-bold">Efficient & Fast</h4>
                 <p className="text-muted">Save time by accessing services from anywhere, anytime.</p>
               </Col>
               <Col md={4} className="text-center p-3">
                  <div className={styles.featureIconWrapper}>
                   <FaMobileAlt />
                 </div>
                 <h4 className="mt-3 fw-bold">Accessible</h4>
                 <p className="text-muted">Designed to be easy to use for all citizens on any device.</p>
               </Col>
             </Row>
          </section>
        </Container>
      </main>
    </div>
  );
};

export default LandingPage;

