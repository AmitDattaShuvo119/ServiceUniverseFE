import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./FormPage.module.css";

const AUSTRALIAN_STATES = [
  { code: "", name: "Select State/Territory" },
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
];

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const [first_name, ...rest] = name.trim().split(" ");
    const last_name = rest.pop() || "";
    const middle_name = rest.join(" ");

    const payload = {
      first_name,
      middle_name,
      last_name,
      date_of_birth: "1995-05-20",
      gender: "Male",
      email,
      phone: "01700000000",
      address: streetAddress,
      city: suburb,
      state_province: state,
      country: "Australia",
      postal_code: postcode,
      password,
    };

    try {
      const res = await fetch("http://localhost:3000/api/citizens/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem(
        "user",
        JSON.stringify({
          first_name,
          last_name,
          email,
          token: data.data.token || "",
          citizen_id: data.data.citizen.citizen_id || "",
        })
      );

      navigate("/user-dashboard"); // redirect
    } catch (err) {
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
              <h1 className={styles.formTitle}>Register for ServiceUniverse</h1>
              <p className="text-muted">
                Create your account to access our full range of services.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <Form onSubmit={handleSubmit}>
              <Card className={styles.sectionCard}>
                <Card.Header as="h5">1. Account Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Create Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className={styles.sectionCard}>
                <Card.Header as="h5">
                  2. Residential Address (Australia)
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="formStreetAddress">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 123 Example Street"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formSuburb">
                    <Form.Label>Suburb/Town/Locality</Form.Label>
                    <Form.Control
                      type="text"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={7}>
                      <Form.Group className="mb-3" controlId="formState">
                        <Form.Label>State/Territory</Form.Label>
                        <Form.Select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        >
                          {AUSTRALIAN_STATES.map((s) => (
                            <option
                              key={s.code}
                              value={s.code}
                              disabled={s.code === ""}
                            >
                              {s.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={5}>
                      <Form.Group className="mb-3" controlId="formPostcode">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                          type="text"
                          pattern="\d{4}"
                          maxLength="4"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          required
                        />
                        <Form.Text className="text-muted">
                          4-digit Australian postcode.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
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
                  {loading ? "Registering..." : "Register Account"}
                </Button>
              </div>
            </Form>

            <p className="text-center mt-3">
              Already have an account?
              <a href="/login" style={{ marginLeft: "5px" }}>
                Login here
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
