import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./FormPage.module.css";

const WWCC_form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    identity_documents: [],
    declaration: false, // Keep for frontend UX, not sent to backend
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "identity_documents") {
      setFormData({ ...formData, identity_documents: files });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token || "";

      const fd = new FormData();
      fd.append("first_name", formData.firstName);
      fd.append("last_name", formData.lastName);
      fd.append("date_of_birth", formData.dob);
      fd.append("gender", formData.gender);
      fd.append("email", formData.email);
      fd.append("phone_number", formData.phone);
      fd.append("address", formData.address);

      // Append files individually
      for (let i = 0; i < formData.identity_documents.length; i++) {
        fd.append("identity_documents", formData.identity_documents[i]);
      }

      const res = await fetch(
        "http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Submission failed");
      }

      // Redirect to feedback page
      navigate("/services/wwcc-feedback");
    } catch (err) {
      console.error("WWCC Submission Error:", err);
      setError(err.message);
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
              <h1 className={styles.formTitle}>WWCC Application Form</h1>
              <p className="text-muted">
                Please fill out the form below to apply for a Working With
                Children Check.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Section 1: Personal Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Personal Details</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formDob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Male"
                        name="gender"
                        type="radio"
                        value="Male"
                        onChange={handleChange}
                        required
                      />
                      <Form.Check
                        inline
                        label="Female"
                        name="gender"
                        type="radio"
                        value="Female"
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        label="Other"
                        name="gender"
                        type="radio"
                        value="Other"
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 2: Contact Details */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">2. Contact Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 3: Document Uploads */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">3. Supporting Documents</Card.Header>
                <Card.Body>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Identity Documents (4 POIs)</Form.Label>
                    <Form.Control
                      type="file"
                      name="identity_documents"
                      onChange={handleChange}
                      multiple
                      required
                    />
                    <Form.Text className="text-muted">
                      Please upload all four of your Proof of Identity
                      documents.
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Section 4: Declaration */}
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">4. Declaration</Card.Header>
                <Card.Body>
                  <Form.Check
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    label="I declare that the information provided is true and correct."
                    required
                  />
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
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WWCC_form;
