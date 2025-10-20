import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Userprofile = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/wwcc-form"); // Navigate to the WWCC_form page
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Top two cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "100px",
          paddingBottom: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          {/* Card 1 */}
          <div className="card" style={{ width: "400px" }}>
            <h5
              className="card-header"
              style={{ backgroundColor: "#002664", color: "white" }}
            >
              Personal Information
            </h5>
            <div className="card-body">
              <table border={0}>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Name:
                    </td>
                    <td style={{ padding: "10px" }}>John Doe</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Date of Birth:
                    </td>
                    <td style={{ padding: "10px" }}>11/10/1990</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Gender:
                    </td>
                    <td style={{ padding: "10px" }}>Male</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Nationality:
                    </td>
                    <td style={{ padding: "10px" }}>American</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ width: "400px" }}>
            <h5
              className="card-header"
              style={{ backgroundColor: "#002664", color: "white" }}
            >
              Contact Information
            </h5>
            <div className="card-body">
              <table border={0}>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Residential Address:
                    </td>
                    <td style={{ padding: "10px" }}>
                      30 Foley St, Gwynneville, Wollongong, NSW 2500
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Mailing Address:
                    </td>
                    <td style={{ padding: "10px" }}>
                      30 Foley St, Gwynneville, Wollongong, NSW 2500
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Phone Number:
                    </td>
                    <td style={{ padding: "10px" }}>0492123123</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      Email:
                    </td>
                    <td style={{ padding: "10px" }}>johndoe@gmail.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Info Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div className="card" style={{ width: "825px" }}>
          <h5
            className="card-header"
            style={{ backgroundColor: "#002664", color: "white" }}
          >
            Tax & Business Info
          </h5>
          <div className="card-body">
            <table border={0}>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>
                    Tax File Number:
                  </td>
                  <td style={{ padding: "10px" }}>412 345 678</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>
                    Australian Business Number:
                  </td>
                  <td style={{ padding: "10px" }}>12 345 678 901</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Buttons below the third card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          paddingBottom: "80px",
        }}
      >
        <div className="text-start mt-4">
          <a
            onClick={handleApply}
            rel="noopener noreferrer"
            className="btn btn-lg apply-btn"
            style={{ backgroundColor: "#002664", color: "white" }}
          >
            View my applications
          </a>
        </div>
        <div className="text-start mt-4">
          <a
            onClick={handleApply}
            rel="noopener noreferrer"
            className="btn btn-lg apply-btn"
            style={{ backgroundColor: "#002664", color: "white" }}
          >
            Edit Profile
          </a>
        </div>
        <div className="text-start mt-4">
          <a
            onClick={handleApply}
            rel="noopener noreferrer"
            className="btn btn-lg apply-btn"
            style={{ backgroundColor: "#002664", color: "white" }}
          >
            Log out
          </a>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
