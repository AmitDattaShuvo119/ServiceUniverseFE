import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceInfo.module.css";

const BirthRegistration = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/services/birth-registration-form");
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Register a Birth</h1>
      <p className={styles.paragraph}>
        In NSW, you are required to register your baby’s birth within 60 days. Registration is free and is the official record of your child's legal identity. Once registered, you can apply for a birth certificate, which is essential for enrolling in school, getting a passport, and accessing other government services.
      </p>

      {/* Accordion Section */}
      <div className="accordion mt-4" id="birthRegAccordion">
        {/* --- Who can register --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingWhoCanRegister">
            <button
              className={`accordion-button fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWhoCanRegister"
              aria-expanded="true"
              aria-controls="collapseWhoCanRegister"
            >
              Who Can Register
            </button>
          </h2>
          <div
            id="collapseWhoCanRegister"
            className="accordion-collapse collapse show"
            aria-labelledby="headingWhoCanRegister"
          >
            <div className="accordion-body">
              <p>Both parents should jointly register the birth if they are in a relationship.</p>
              <p>
                If the parents are not together, one parent can register the birth. The other parent's details will still need to be provided.
              </p>
            </div>
          </div>
        </div>

        {/* --- Required Information --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingInformation">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseInformation"
              aria-expanded="false"
              aria-controls="collapseInformation"
            >
              Required Information
            </button>
          </h2>
          <div
            id="collapseInformation"
            className="accordion-collapse collapse"
            aria-labelledby="headingInformation"
          >
            <div className="accordion-body">
              <p>
                To complete the registration, you will need the following information:
              </p>
              <ul>
                <li>The child’s full name, date of birth, and place of birth</li>
                <li>The full names, dates of birth, and places of birth for both parents</li>
                <li>Your residential address and contact details</li>
                <li>The Birth Registration Statement provided by the hospital or midwife</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- How to Register --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingHowToRegister">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseHowToRegister"
              aria-expanded="false"
              aria-controls="collapseHowToRegister"
            >
              How to Register Online
            </button>
          </h2>
          <div
            id="collapseHowToRegister"
            className="accordion-collapse collapse"
            aria-labelledby="headingHowToRegister"
          >
            <div className="accordion-body">
              <ol>
                <li>Click the ‘Register a Birth Online’ button below to start your application.</li>
                <li>Fill in the details for the child and both parents accurately.</li>
                <li>Verify your identity and review all the information provided.</li>
                <li>Submit the registration. You can also order a birth certificate for a fee during this process.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="text-start mt-4">
        <button
          onClick={handleApply}
          className={`btn btn-lg ${styles.applyBtn}`}
        >
          Register a Birth Online
        </button>
      </div>
    </div>
  );
};

export default BirthRegistration;

