import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaBook,
  FaHeartbeat,
  FaChild,
  FaFileInvoiceDollar,
  FaUsers,
  FaLaptopCode,
  FaGlobeAmericas,
  FaLandmark,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Services.module.css";

const servicesData = [
  {
    title: "Civil Registration",
    icon: <FaBook />,
    subServices: [
      { name: "Register a Birth", link: "/services/birth-registration" },
      { name: "Register a Death", link: "/services/death-registration" },
      { name: "Register a Marriage", link: "/services/marriage-registration" },
    ],
  },
  {
    title: "Vaccination Records",
    icon: <FaHeartbeat />,
    subServices: [
      {
        name: "Add a Vaccination Record",
        link: "/services/vaccination-records",
      },
      { name: "View Immunaization History", link: "/" },
    ],
  },
  {
    title: "Working With Children Check (WWCC)",
    icon: <FaChild />,
    subServices: [
      { name: "Apply for WWCC Certificate", link: "/services/wwcc" },
      { name: "View My Application", link: "/services/wwcc-status" },
      { name: "View or Download Certificate", link: "/services/wwcc-status" },
    ],
  },
  {
    title: "Australian Taxation Office – ATO",
    icon: <FaFileInvoiceDollar />,
    subServices: [
      { name: "Income Tax Returns and Assessments", link: "/tax-estimator" },
      { name: "Superannuation and Business Tax", link: "/" },
    ],
  },
  {
    title: "Centrelink",
    icon: <FaUsers />,
    subServices: [{ name: "Apply for Financial Assistance ", link: "/" }],
  },
  {
    title: "Australian Computer Society (ACS)",
    icon: <FaLaptopCode />,
    subServices: [
      { name: "Skills Assessment", link: "/" },
      { name: "Student Memberships", link: "/" },
    ],
  },
  {
    title: "Family History & Genealogy",
    icon: <FaLandmark />,
    subServices: [{ name: "Family History and Genealogy Service", link: "/" }],
  },
  {
    title: "Home Affairs ImmiAccount",
    icon: <FaGlobeAmericas />,
    subServices: [
      {
        name: "Visa applications and status tracking",
        link: "/services/immi-visa",
      },
      {
        name: "Citizenship and sponsorship",
        link: "/services/immi-citizenship",
      },
    ],
  },
];

const ServicesPage = () => {
  const [wwccStatus, setWwccStatus] = useState(null);

  useEffect(() => {
    // Fetch WWCC application status if logged in user has an application
    const fetchWWCCStatus = async () => {
      try {
        const citizenId = localStorage.getItem("citizenId"); // adjust key if different
        if (!citizenId) return;

        const res = await fetch(
          `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/citizen/${citizenId}`
        );
        if (!res.ok) throw new Error("Failed to fetch WWCC status");

        const data = await res.json();
        // Example: data.status = "Pending" | "Approved" | "Rejected"
        setWwccStatus(data.status);
      } catch (err) {
        console.error("Error fetching WWCC status:", err);
      }
    };

    fetchWWCCStatus();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.heroSection}>
        <Container className="text-center text-white">
          <h1 className={styles.heroTitle}>All Citizen Services</h1>
          <p className={styles.heroSubtitle}>
            Find and access all government services in one convenient place.
          </p>
        </Container>
      </header>

      {/* Services Grid */}
      <Container className="py-5">
        <Row xs={1} md={2} lg={3} className="g-4">
          {servicesData.map((service, index) => (
            <Col key={index}>
              <Card className={`${styles.serviceCard} h-100`}>
                <Card.Header className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>{service.icon}</div>
                  <Card.Title as="h3" className={styles.cardTitle}>
                    {service.title}
                  </Card.Title>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  {/* For WWCC only */}
                  {service.title === "Working With Children Check" ? (
                    <>
                      <ul className={styles.subServiceList}>
                        <li>
                          <Link
                            to="/services/wwcc"
                            className={styles.subServiceLink}
                          >
                            Apply for WWCC Certificate
                            <FaArrowRight className={styles.subServiceIcon} />
                          </Link>
                        </li>

                        {/* If WWCC application is active */}
                        {wwccStatus &&
                          (wwccStatus === "Pending" ||
                            wwccStatus === "Rejected") && (
                            <li className="text-center my-3">
                              <Button
                                variant="warning"
                                className="fw-semibold"
                                as={Link}
                                to="/services/wwcc-status"
                              >
                                View My Application
                              </Button>
                            </li>
                          )}

                        <li>
                          <Link to="/" className={styles.subServiceLink}>
                            View or Download Certificate
                            <FaArrowRight className={styles.subServiceIcon} />
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      {service.subServices ? (
                        <ul className={styles.subServiceList}>
                          {service.subServices.map((sub, sIndex) => (
                            <li key={sIndex}>
                              <Link
                                to={sub.link}
                                className={styles.subServiceLink}
                              >
                                {sub.name}
                                <FaArrowRight
                                  className={styles.subServiceIcon}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Link
                          to={service.link}
                          className={`btn btn-primary mt-auto ${styles.actionButton}`}
                        >
                          Go to service <FaArrowRight className="ms-2" />
                        </Link>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ServicesPage;
