import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceInfo.module.css";

const MarriageRegistration = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/services/marriage-registration-form");
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Register a Marriage</h1>
      <p className={styles.paragraph}>
        In NSW, your authorised marriage celebrant is responsible for registering your marriage with the Registry of Births, Deaths & Marriages within 14 days of the ceremony. This registration is free and creates a legal record of your marriage. Once registered, you can apply for an official marriage certificate.
      </p>

      {/* Accordion Section */}
      <div className="accordion mt-4" id="marriageRegAccordion">
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
              Eligibility to Marry
            </button>
          </h2>
          <div
            id="collapseEligibility"
            className="accordion-collapse collapse show"
            aria-labelledby="headingEligibility"
          >
            <div className="accordion-body">
              <p>To get married in Australia, you must meet the following requirements:</p>
              <ul>
                <li>You must not be married to someone else.</li>
                <li>You must not be marrying a parent, grandparent, child, grandchild, brother or sister.</li>
                <li>You must be at least 18 years old, unless a court has approved a marriage where one person is 16 or 17.</li>
                <li>You must understand what marriage means and freely consent to marrying.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- What You'll Need --- */}
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
              What You'll Need
            </button>
          </h2>
          <div
            id="collapseInformation"
            className="accordion-collapse collapse"
            aria-labelledby="headingInformation"
          >
            <div className="accordion-body">
              <p>
                Before your ceremony, you must give your authorised celebrant a completed Notice of Intended Marriage (NOIM) form. You'll also need to provide:
              </p>
              <ul>
                <li>Proof of identity (such as a passport or an original birth certificate).</li>
                <li>If you have been married before, proof that the last marriage has ended (e.g., a divorce certificate or death certificate).</li>
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
                <li>Lodge the Notice of Intended Marriage with your celebrant at least one month before your wedding day.</li>
                <li>Hold your marriage ceremony. You will sign three marriage certificates on the day.</li>
                <li>Your celebrant will submit the official paperwork to the Registry of Births, Deaths & Marriages to register the marriage.</li>
                <li>Once registered, you can apply for an official marriage certificate, which is often required for legal purposes.</li>
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
          Apply for a Marriage Certificate
        </button>
      </div>
    </div>
  );
};

export default MarriageRegistration;

