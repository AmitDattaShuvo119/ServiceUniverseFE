import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ icon, title, text, link }) => {
  return (
    <Col>
      <Card className={`${styles.serviceCard} h-100`}>
        <Card.Body className="d-flex flex-column text-center p-4">
          <div className="mb-3">
            <div className={styles.iconWrapper}>{icon}</div>
          </div>
          <Card.Title as="h4" className="mt-3">{title}</Card.Title>
          <Card.Text className="text-muted flex-grow-1">{text}</Card.Text>
          <Button as={Link} to={link || '#'} variant="outline-primary" className="mt-3 align-self-center">
            Open Service
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ServiceCard;

