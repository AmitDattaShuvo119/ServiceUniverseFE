import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceInfo.module.css";

const DeathRegistration = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/services/death-registration-form");
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Register a Death</h1>
      <p className={styles.paragraph}>
        In NSW, a death must be registered within 7 days. This is a free service and creates a permanent record of the death. The funeral director will usually register the death on your behalf. Once registered, you can apply for a death certificate, which is required for legal and administrative tasks like managing the deceased's estate.
      </p>

      {/* Accordion Section */}
      <div className="accordion mt-4" id="deathRegAccordion">
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
              <p>Typically, the funeral director registers the death with the Registry of Births, Deaths & Marriages.</p>
              <p>
                If a funeral director is not involved, a relative, a person present at the death, or the occupier of the building where the death occurred is responsible for the registration.
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
                To complete the registration, the following information is needed:
              </p>
              <ul>
                <li>The deceased's full name, date of birth, and place of birth</li>
                <li>The date, time, and place of death</li>
                <li>Details of their parents and any spouses or partners</li>
                <li>Information from the Medical Certificate of Cause of Death provided by a doctor</li>
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
              How to Register
            </button>
          </h2>
          <div
            id="collapseHowToRegister"
            className="accordion-collapse collapse"
            aria-labelledby="headingHowToRegister"
          >
            <div className="accordion-body">
              <ol>
                <li>Engage a funeral director who will collect the required information and the medical certificate to lodge the registration for you.</li>
                <li>If registering yourself, you will need to complete the 'Notice of Death' form.</li>
                <li>Submit the completed form along with the medical certificate.</li>
                <li>Once registered, you can apply to receive an official death certificate.</li>
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
          Register a Death Online
        </button>
      </div>
    </div>
  );
};

export default DeathRegistration;

