import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          {/* Find Services Column */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className={styles.footerTitle}>Find Services</h5>
            <ul className="list-unstyled">
              <li><Link to="/services/a-z" className={styles.footerLink}>A to Z list of services</Link></li>
              <li><Link to="/services/births-deaths-marriages" className={styles.footerLink}>Births, relationships and deaths</Link></li>
              <li><Link to="/services/boating-fishing" className={styles.footerLink}>Boating, fishing and outdoors</Link></li>
              <li><Link to="/services/business-employment" className={styles.footerLink}>Business, industries and employment</Link></li>
              <li><Link to="/services/concessions-rebates" className={styles.footerLink}>Concessions, rebates and assistance</Link></li>
              <li><Link to="/services/driving-transport" className={styles.footerLink}>Driving and transport</Link></li>
            </ul>
          </Col>

          {/* Service NSW Column */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className={styles.footerTitle}>Service NSW</h5>
            <ul className="list-unstyled">
              <li><Link to="/about-us" className={styles.footerLink}>About us</Link></li>
              <li><Link to="/jobs" className={styles.footerLink}>Jobs at Service NSW</Link></li>
              <li><Link to="/news" className={styles.footerLink}>News</Link></li>
              <li><Link to="/maintenance" className={styles.footerLink}>Scheduled maintenance</Link></li>
              <li><Link to="/performance" className={styles.footerLink}>Performance dashboard</Link></li>
              <li><Link to="/app" className={styles.footerLink}>Download the Service NSW app</Link></li>
            </ul>
          </Col>

          {/* Contact Column */}
          <Col lg={4} md={12}>
             <h5 className={styles.footerTitle}>Contact</h5>
             <ul className="list-unstyled">
                <li><Link to="/contact-form" className={styles.footerLink}>Contact form</Link></li>
                <li><a href="tel:137788" className={styles.footerLink}>Phone 13 77 88</a></li>
                <li><Link to="/find-location" className={styles.footerLink}>Find a Service NSW location</Link></li>
                <li><Link to="/find-agency" className={styles.footerLink}>Find a NSW Government agency</Link></li>
             </ul>
             <div className="mt-3">
               <a href="https://facebook.com" className={styles.socialIcon} aria-label="Facebook"><FaFacebookF /></a>
               <a href="https://linkedin.com" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedinIn /></a>
               <a href="https://instagram.com" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>
               <a href="https://youtube.com" className={styles.socialIcon} aria-label="YouTube"><FaYoutube /></a>
             </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

