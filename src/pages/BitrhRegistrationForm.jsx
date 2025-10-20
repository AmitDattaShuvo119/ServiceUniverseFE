import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BirthRegistrationForm = () => {
  const [formData, setFormData] = useState({
    birth_certificate_number: "",
    child_first_name: "",
    child_last_name: "",
    date_of_birth: "",
    place_of_birth: "",
    city: "",
    state_province: "",
    country: "",
    gender: "",
    mother_first_name: "",
    mother_last_name: "",
    registrar_name: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token || "";
      const response = await fetch(
        "http://localhost:3000/api/services/birthRecords/api/birth-records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Birth record submitted successfully!");
        navigate("/services/birth-feedback");
      } else {
        alert(result.error || "Failed to create birth record");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4" style={{ color: "#002664" }}>
        Birth Registration Form
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Birth Certificate Number */}
        <div className="form-group mb-3">
          <label>Birth Certificate Number</label>
          <input
            type="text"
            name="birth_certificate_number"
            className="form-control"
            value={formData.birth_certificate_number}
            onChange={handleChange}
            required
          />
        </div>

        {/* Child Information */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Child First Name</label>
            <input
              type="text"
              name="child_first_name"
              className="form-control"
              value={formData.child_first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Child Last Name</label>
            <input
              type="text"
              name="child_last_name"
              className="form-control"
              value={formData.child_last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date and Place of Birth */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              className="form-control"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Place of Birth</label>
            <input
              type="text"
              name="place_of_birth"
              className="form-control"
              value={formData.place_of_birth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Location Fields */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>City</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>State / Province</label>
            <input
              type="text"
              name="state_province"
              className="form-control"
              value={formData.state_province}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Country</label>
            <input
              type="text"
              name="country"
              className="form-control"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="form-group mb-3">
          <label>Gender</label>
          <select
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Parent Info */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Mother First Name</label>
            <input
              type="text"
              name="mother_first_name"
              className="form-control"
              value={formData.mother_first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Mother Last Name</label>
            <input
              type="text"
              name="mother_last_name"
              className="form-control"
              value={formData.mother_last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Registrar */}
        <div className="form-group mb-4">
          <label>Registrar Name</label>
          <input
            type="text"
            name="registrar_name"
            className="form-control"
            value={formData.registrar_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-lg"
            style={{
              backgroundColor: "#002664",
              color: "white",
              padding: "10px 30px",
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthRegistrationForm;
