import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./FormPage.module.css";

const Login_Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessageType("error");
        throw new Error(result.error || "Login failed");
      }

      const adminData = {
        username: result.data.username || username,
        token: result.data.token,
        admin_id: result.data.admin_id || "",
      };

      localStorage.setItem("admin", JSON.stringify(adminData));

      setMessageType("success");
      setMessage(`Welcome, ${adminData.username}! Redirecting...`);

      setTimeout(() => {
        navigate("/admin-applications");
      }, 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer} style={{ minHeight: "90vh" }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={8} sm={10}>
            <div className="text-center mb-6">
              <h1 className={styles.formTitle}>
                Welcome Back to ServiceUniverse's Admin Portal
              </h1>
              <p className="text-sm text-gray-600">
                Sign in with your username and password to continue.
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
                  <Form.Group className="mb-3" controlId="loginFormUsername">
                    <Form.Label className="font-medium text-gray-700">
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      required
                    />
                  </Form.Group>

                  <div className="text-center mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-semibold">
                Register here
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login_Admin;
