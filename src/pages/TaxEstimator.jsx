import React, { useState } from "react";

const TaxEstimator = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    year: "2025",
    earnings: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTax = (income) => {
    if (income <= 18200) return 0;
    if (income <= 45000) return (income - 18200) * 0.16;
    if (income <= 135000) return 4288 + (income - 45000) * 0.3;
    if (income <= 190000) return 31288 + (income - 135000) * 0.37;
    return 51638 + (income - 190000) * 0.45;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tax = calculateTax(Number(formData.earnings));
    setResult(tax);
  };

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h2
            className="card-title text-center mb-4"
            style={{ color: "#002664" }}
          >
            {" "}
            ATO Tax Estimation Portal
          </h2>
          <p
            className="text-muted text-center mb-4"
            style={{ fontSize: "0.9rem" }}
          >
            Australian residents have a tax-free threshold of{" "}
            <strong>$18,200</strong>. Income above this is taxed progressively
            at <strong>16%, 30%, 37%,</strong> and
            <strong> 45%</strong> for higher brackets. These rates exclude the
            2% Medicare levy. Refunds or tax payable depend on total tax
            withheld during the year. NSW follows the same federal tax rates.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-select"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="earnings"
                placeholder="Total Estimated Earnings (AUD)"
                value={formData.earnings}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#002664", color: "#fff" }}
            >
              Calculate Tax
            </button>
          </form>

          {result !== null && (
            <div className="mt-4 text-center">
              {result > 0 ? (
                <p className="text-danger fw-bold">
                  ⚠️ You owe approximately ${result.toFixed(2)} in tax.
                </p>
              ) : (
                <p className="text-success fw-bold">
                  ✅ You have no tax payable.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxEstimator;
