import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceInfo.module.css";

const WWCC = () => {
  const navigate = useNavigate();

  const handleApply = async () => {
    try {
      // Get logged-in user info from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const citizenId = user?.citizen_id;

      if (!token || !citizenId) {
        alert("Please log in to apply for WWCC.");
        return;
      }

      // Fetch user's existing applications
      const response = await fetch(
        `http://localhost:3000/api/services/wwccProvider/api/wwcc-applications/citizen/${citizenId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check your existing applications.");
      }

      const data = await response.json();

      // Check if user already has a pending or approved application
      const hasActiveApplication = data?.data?.some(
        (app) =>
          app.approval_status === "pending" ||
          app.approval_status === "approved"
      );
      console.log("Existing applications:", data?.data);

      if (hasActiveApplication) {
        alert(
          "You already have a pending or approved WWCC application. You can only reapply if your previous one was rejected."
        );
        return;
      }

      // If no active applications — allow applying
      navigate("/services/wwcc-form");
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Working With Children Check</h1>
      <p className={styles.paragraph}>
        The Working with Children Check (WWCC) is a requirement for anyone who
        works or volunteers in child-related work in NSW. It involves a National
        Police Check and a review of workplace misconduct. The outcome of a
        check is either a clearance to work with children or a bar against
        working with children. If cleared, the check will be valid for 5 years
        and applicants are continuously monitored.
      </p>

      {/* Accordion Section */}
      <div className="accordion mt-4" id="wwccAccordion">
        {/* --- Eligibility --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingEligibility">
            <button
              className={`accordion-button fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEligibility"
              aria-expanded="true"
              aria-controls="collapseEligibility"
            >
              Eligibility
            </button>
          </h2>
          <div
            id="collapseEligibility"
            className="accordion-collapse collapse show"
            aria-labelledby="headingEligibility"
          >
            <div className="accordion-body">
              <p>Must be over 18 years old.</p>
              <p>
                Both paid workers and volunteers in child-related roles are
                required to apply.
              </p>
            </div>
          </div>
        </div>

        {/* --- Required Documents --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingDocuments">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDocuments"
              aria-expanded="false"
              aria-controls="collapseDocuments"
            >
              Required Documents
            </button>
          </h2>
          <div
            id="collapseDocuments"
            className="accordion-collapse collapse"
            aria-labelledby="headingDocuments"
          >
            <div className="accordion-body">
              <p>
                You’ll need to provide{" "}
                <strong>four proof of identity (POI)</strong> documents:
              </p>
              <ul>
                <li>One commencement of identity document</li>
                <li>One primary use in the community document</li>
                <li>Two secondary use in the community documents</li>
              </ul>
              <p>
                At least one document must include both your{" "}
                <strong>photo and signature</strong>. All POI documents must be{" "}
                <strong>current and original</strong>.
              </p>
              <p className={styles.subheading}>Not accepted:</p>
              <ul>
                <li>Laminated original paper documents</li>
                <li>Photos, photocopies, or certified copies</li>
                <li>Expired documents (unless stated otherwise)</li>
              </ul>
              <p>
                <span className={styles.subheading}>Note:</span> If your primary
                document is not a NSW Driver Licence or NSW Photo Card, you’ll
                need to apply for a Transport for NSW customer number. A NSW
                Digital Driver Licence is accepted, but other digital IDs (like
                a digital Medicare card) are not.
              </p>
            </div>
          </div>
        </div>

        {/* --- How to Apply --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingApply">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseApply"
              aria-expanded="false"
              aria-controls="collapseApply"
            >
              How to Apply
            </button>
          </h2>
          <div
            id="collapseApply"
            className="accordion-collapse collapse"
            aria-labelledby="headingApply"
          >
            <div className="accordion-body">
              <ol>
                <li>
                  Click the ‘Apply online’ button on the NSW Service portal.
                </li>
                <li>
                  Provide all required information — ensure your name matches
                  your identity documents exactly.
                </li>
                <li>Submit your application and wait for confirmation.</li>
              </ol>
              <p>
                <span className={styles.subheading}>Note:</span> After
                submitting, your application will be reviewed. You’ll receive
                feedback within <strong>7 business days</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="text-start mt-4">
        <button
          onClick={handleApply}
          className={`btn btn-lg ${styles.applyBtn}`}
        >
          Apply Online
        </button>
      </div>
    </div>
  );
};

export default WWCC;
