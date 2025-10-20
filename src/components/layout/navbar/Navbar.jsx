import React, { useState, useEffect } from "react";
import { FaUniversity } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for citizen login
    const citizenData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin");

    if (adminData) {
      setUser({ type: "admin", data: JSON.parse(adminData) });
    } else if (citizenData) {
      setUser({ type: "citizen", data: JSON.parse(citizenData) });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    window.location.href = "/"; // redirect to home
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <FaUniversity className={styles.logoIcon} />
        <span>Service Universe</span>
      </div>

      <nav className={styles.desktopNav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Services
        </NavLink>

        <a href="#support" className={styles.navLink}>
          Support
        </a>

        <NavLink
          to={
            user?.type === "citizen"
              ? "/user-dashboard"
              : "/services/wwcc-status"
          }
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          {user
            ? user.type === "admin"
              ? `Admin - ${user.data.username}`
              : `${user.data.first_name}`
            : "My Account"}
        </NavLink>
      </nav>

      {user ? (
        <Button
          style={{ backgroundColor: "#0e63fd", color: "white" }}
          variant="outline-light"
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button as={Link} to="/login" className={styles.loginBtn}>
          Login
        </Button>
      )}
    </header>
  );
};

export default Navbar;
