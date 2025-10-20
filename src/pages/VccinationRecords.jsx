import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceInfo.module.css";

const VaccinationRecords = () => {
  const navigate = useNavigate();

  const handleAddRecord = () => {
    navigate("/services/add-vaccination-record");
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Vaccination Records</h1>
      <p className={styles.paragraph}>
        Access your complete immunisation history statement for proof of vaccinations. Your statement includes records of all vaccinations you've had, including COVID-19 vaccines and annual flu shots, as recorded on the Australian Immunisation Register.
      </p>

      {/* Accordion Section */}
      <div className="accordion mt-4" id="vaccinationAccordion">
        {/* --- Viewing Your Record --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingView">
            <button
              className={`accordion-button fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseView"
              aria-expanded="true"
              aria-controls="collapseView"
            >
              Viewing Your Record
            </button>
          </h2>
          <div
            id="collapseView"
            className="accordion-collapse collapse show"
            aria-labelledby="headingView"
          >
            <div className="accordion-body">
              You can view your immunisation history statement online through your service universe portal. Statements for children under 14 will also be available on your record.
            </div>
          </div>
        </div>

        {/* --- Required Information --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingInfo">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseInfo"
              aria-expanded="false"
              aria-controls="collapseInfo"
            >
              Required Information
            </button>
          </h2>
          <div
            id="collapseInfo"
            className="accordion-collapse collapse"
            aria-labelledby="headingInfo"
          >
            <div className="accordion-body">
              To access or add records, you will generally need:
              <ul>
                <li>Your Medicare card details</li>
                <li>Personal identification, such as a driver's license</li>
                <li>Details of the vaccination, including the date, vaccine brand, and provider</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- How to Add a Record --- */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingAdd">
            <button
              className={`accordion-button collapsed fw-bold ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAdd"
              aria-expanded="false"
              aria-controls="collapseAdd"
            >
              How to Add a Record
            </button>
          </h2>
          <div
            id="collapseAdd"
            className="accordion-collapse collapse"
            aria-labelledby="headingAdd"
          >
            <div className="accordion-body">
              If a vaccination is missing from your record, you can ask your healthcare provider to update the Australian Immunisation Register. You can also add certain records yourself through the designated portal.
              <ol>
                <li>Click the ‘Add a Record’ button below.</li>
                <li>Fill in all required information about the vaccination.</li>
                <li>Submit the form for review.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="text-start mt-4">
        <button
          onClick={handleAddRecord}
          className={`btn btn-lg ${styles.applyBtn}`}
        >
          Add a Record
        </button>
      </div>
    </div>
  );
};

export default VaccinationRecords;

