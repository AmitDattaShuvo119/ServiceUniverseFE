import React, { useState, useCallback } from "react";
import styles from "./ServiceUniversePortal.module.css";

// Import form components (assuming you have created these files)
import Login from "./Login";
import Register from "./Register";

// Replace with your own images/icons
const placeholderImage = "https://i.imgur.com/3vFPCFQ.png";

const ALL_SERVICES = [
  {
    title: "Population Documents",
    subtitle: "ID Card, Family Card, Certificates",
    linkText: "Documents",
    img: placeholderImage,
  },
  {
    title: "Income Tax Returns",
    subtitle: "E-filing, Status Check, Tax Deductions",
    linkText: "Documents",
    img: placeholderImage,
  },
  {
    title: "Transport and Licences",
    subtitle: "Vehicle Registration, Driver’s Licence",
    linkText: "Documents",
    img: placeholderImage,
  },
  {
    title: "Births, relationships and deaths",
    subtitle: "Registrations, Certificates, Name change",
    linkText: "Documents",
    img: placeholderImage,
  },
  {
    title: "Health Services",
    subtitle: "Appointments, Records, Prescriptions",
    linkText: "Documents",
    img: placeholderImage,
  },
  {
    title: "Business Registration",
    subtitle: "ABN, Licences, Permits",
    linkText: "Documents",
    img: placeholderImage,
  },
];

const ServiceCard = ({ title, subtitle, linkText, img }) => (
  <div className={styles.serviceCard}>
    <img src={img || placeholderImage} alt={title} />
    <div className={styles.cardTitle}>{title}</div>
    <div className={styles.cardSubtitle}>{subtitle}</div>
    <a href="#!" className={styles.cardLink}>
      {linkText}
    </a>
  </div>
);

const ServiceUniversePortal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageView, setPageView] = useState("home");
  const [searchActive, setSearchActive] = useState(false);

  // Determine if we are on a form page (used to hide navigation bar)
  const isFormView = pageView === "login" || pageView === "register";

  // Determine if we are in a state that shows the full service list
  const isServicesView = pageView === "services" || searchActive;

  // Function to handle navigation clicks
  const handleNavigation = useCallback(
    (view) => (e) => {
      if (e) e.preventDefault();
      setPageView(view);
      setSearchTerm("");
      // Set searchActive to false when navigating to 'home' or 'login'
      setSearchActive(view === "services" ? true : false);
    },
    []
  );

  // Handler for search bar focus/change
  const handleSearchFocus = () => {
    // If user interacts with search, change view to 'services' (full list) and activate search
    if (pageView !== "services") {
      setPageView("services");
    }
    setSearchActive(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchActive(true);
    setPageView("services"); // Ensure we switch to services view when typing
  };

  const filteredServices = ALL_SERVICES.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let displayedServices;

  if (searchTerm) {
    displayedServices = filteredServices;
  } else if (isServicesView) {
    displayedServices = ALL_SERVICES;
  } else {
    // Default Home view: show only the first 3 services
    displayedServices = ALL_SERVICES.slice(0, 3);
  }

  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1546268060-2592ff93ee24?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340";

  // Function to render the correct content component
  const renderContent = () => {
    switch (pageView) {
      case "login":
        return <Login setPageView={setPageView} />;
      case "register":
        return <Register setPageView={setPageView} />;
      default:
        // Render the main portal content (Hero/Services Grid)
        return (
          <>
            {/* Hero section and action buttons are hidden when in Services/Search view */}
            {!isServicesView && (
              <>
                <div
                  className={styles.hero}
                  style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                >
                  <div className={styles.heroOverlay}>
                    <h1>Digital Services</h1>
                    <h2>New South Wales</h2>
                  </div>
                </div>
                <div className={styles.officialPortal}>
                  • Official Portal of New South Wales Government
                </div>
                <p className={styles.platformDescription}>
                  Integrated platform to access all government services
                  <br />
                  <strong>Efficient • Transparent • Trusted</strong>
                </p>

                <div className={styles.actionButtons}>
                  <div className={styles.actionBtn}>📄 Start Service →</div>
                  <div className={styles.actionBtn}>📞 24/7 Support →</div>
                </div>
              </>
            )}

            <h2 className={styles.mainServicesTitle}>
              {isServicesView ? "Browse services by topic" : "Main Services"}
            </h2>

            {!isServicesView && (
              <p className={styles.mainServicesSubtitle}>
                Quick access to the most frequently used services
              </p>
            )}

            <div className={styles.servicesGrid}>
              {displayedServices.map((service, idx) => (
                <ServiceCard key={idx} {...service} />
              ))}
              {displayedServices.length === 0 && searchTerm && (
                <p className={styles.noResults}>
                  No services found for "{searchTerm}"
                </p>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* ADDED onClick AND style TO LOGO */}
        <div
          className={styles.logo}
          onClick={handleNavigation("home")}
          style={{ cursor: "pointer" }}
        >
          ServiceUniverse
        </div>

        <div className={styles.searchBar}>
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search Services ..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={() => {
                if (!searchTerm && pageView !== "services") {
                  setSearchActive(false);
                }
              }}
            />
          </div>
        </div>

        {/* HIDE NAVIGATION BAR IF WE ARE ON LOGIN or REGISTER PAGE */}
        {!isFormView && (
          <nav className={styles.nav}>
            <a
              href="#home"
              className={`${styles.navItem} ${
                pageView === "home" && !searchActive ? styles.navItemActive : ""
              }`}
              onClick={handleNavigation("home")}
            >
              Home
            </a>
            <a
              href="#services"
              className={`${styles.navItem} ${
                pageView === "services" || searchActive
                  ? styles.navItemActive
                  : ""
              }`}
              onClick={handleNavigation("services")}
            >
              Services
            </a>
            <a
              href="#login"
              className={`${styles.navItem} ${
                pageView === "login" ? styles.navItemActive : ""
              }`}
              onClick={handleNavigation("login")}
            >
              Login
            </a>
          </nav>
        )}
      </header>

      {/* RENDER THE CORRECT PAGE CONTENT */}
      <div className={styles.mainContent}>{renderContent()}</div>

      <footer className={styles.footer}>
        © 2025 NSW Government. All rights reserved.
      </footer>
    </div>
  );
};

export default ServiceUniversePortal;
