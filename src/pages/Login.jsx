import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./FormPage.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/citizens/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessageType("error");
        throw new Error(result.error || "Login failed");
      }

      // Use the API data properly
      const userData = result.data.citizen || {};

      localStorage.setItem(
        "user",
        JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          token: result.data.token,
          citizen_id: result.data.citizen.citizen_id || "",
        })
      );
      

      setMessageType("success");
      setMessage(`Welcome, ${userData.first_name}! Redirecting...`);

      setTimeout(() => {
        navigate("/user-dashboard"); // redirect to dashboard/home
      }, 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={8} sm={10}>
            <div className="text-center mb-6">
              <h1 className={styles.formTitle}>
                Welcome Back to ServiceUniverse
              </h1>
              <p className="text-sm text-gray-600">
                Sign in with your email and password to continue.
              </p>
            </div>

            <Card className={styles.sectionCard}>
              <Card.Body className="p-5">
                {message && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      messageType === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    } font-semibold text-center`}
                  >
                    {message}
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="loginFormEmail">
                    <Form.Label className="font-medium text-gray-700">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-lg py-2"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="loginFormPassword">
                    <Form.Label className="font-medium text-gray-700">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg py-2"
                      required
                    />
                    <div className="text-right mt-1">
                      <a
                        href="#!"
                        className="text-sm text-blue-500 hover:text-blue-700 transition duration-150"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </Form.Group>

                  <div className="text-center mt-4">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className={styles.submitButton}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 ml-1"
              >
                Register here
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
