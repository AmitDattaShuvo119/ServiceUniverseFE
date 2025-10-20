import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import styles from "./UserDashboard.module.css";
import {
  Archive,
  Home,
  DollarSign,
  FileText,
  Users,
  Globe,
  Heart,
  GraduationCap,
  BarChart3,
  Check,
  Clock,
  X,
} from "lucide-react";

// --- SERVICE DATA ---
const SERVICE_DATA = [
  {
    id: "civil",
    category: "Identity & Life Events",
    title: "Civil Registration",
    icon: Archive,
    description:
      "Register and manage official certificates for births, deaths, and marriages.",
    links: [
      {
        name: "Register a Birth",
        status: "Completed",
        detail: "Certificate Ready",
      },
      { name: "Register a Death", status: "New", detail: "Start Application" },
      {
        name: "Register a Marriage",
        status: "Pending",
        detail: "Submitted 10/10/2025",
      },
    ],
  },
  {
    id: "vaccination",
    category: "Identity & Life Events",
    title: "Vaccination Records",
    icon: FileText,
    description: "Access your official immunization history and records.",
    links: [
      {
        name: "View Digital Certificate",
        status: "Completed",
        detail: "View PDF",
      },
    ],
  },
  {
    id: "wwcc",
    category: "Identity & Life Events",
    title: "Working With Children Check (WWCC)",
    icon: Users,
    description: "Manage your screening check status and application details.",
    links: [
      {
        name: "Check Status & Apply",
        status: "Completed",
        detail: "Card Valid until 2028",
      },
    ],
  },
  {
    id: "ato",
    category: "Financial & Tax",
    title: "Australian Taxation Office (ATO)",
    icon: DollarSign,
    description: "Lodge income tax, manage superannuation, and business tax.",
    links: [
      {
        name: "Income Tax Returns & Assessments",
        status: "Action Required",
        detail: "Lodge 2024 Return",
      },
      {
        name: "Superannuation & Business Tax Services",
        status: "Completed",
        detail: "View Statements",
      },
    ],
  },
  {
    id: "centerlink",
    category: "Financial & Tax",
    title: "Centerlink Payments",
    icon: Home,
    description: "Access government payments for financial assistance.",
    links: [
      {
        name: "Payments for Financial Assistance",
        status: "Completed",
        detail: "Recent Payment: $500",
      },
    ],
  },
  {
    id: "support",
    category: "Financial & Tax",
    title: "Social Support Payments",
    icon: Heart,
    description:
      "Manage claims for Youth Allowance, JobSeeker, Age Pension, Disability Support, etc.",
    links: [
      {
        name: "Manage All Support Payments",
        status: "Pending",
        detail: "JobSeeker Application",
      },
    ],
  },
  {
    id: "immi",
    category: "Immigration & Status",
    title: "Home Affairs - Immi Account",
    icon: Globe,
    description:
      "Track visa status, apply for citizenship, and manage sponsorships.",
    links: [
      {
        name: "Visa Applications & Status Tracking",
        status: "Pending",
        detail: "Processing Time: 3 Months",
      },
      {
        name: "Citizenship/Sponsorship Management",
        status: "Completed",
        detail: "View Sponsorship Details",
      },
    ],
  },
  {
    id: "acs",
    category: "Professional Development",
    title: "Australian Computer Society (ACS)",
    icon: GraduationCap,
    description: "Skills assessment for migration and student memberships.",
    links: [
      { name: "Skills Assessment", status: "New", detail: "Start Application" },
      {
        name: "Student Memberships",
        status: "Completed",
        detail: "Membership ID: 12345",
      },
    ],
  },
  {
    id: "family",
    category: "Professional Development",
    title: "Family History & Genealogy",
    icon: BarChart3,
    description: "Access historical records and build your family tree.",
    links: [
      {
        name: "Search Records & Request Documents",
        status: "Completed",
        detail: "Last Search: 1 Week Ago",
      },
    ],
  },
];

// --- UTILITY FUNCTION ---
const getStatusClasses = (status) => {
  switch (status) {
    case "Completed":
      return {
        className: styles.statusCompleted,
        icon: Check,
        detailClass: styles.detailCompleted,
      };
    case "Pending":
      return {
        className: styles.statusPending,
        icon: Clock,
        detailClass: styles.detailPending,
      };
    case "Action Required":
    case "New":
      return {
        className: styles.statusAction,
        icon: X,
        detailClass: styles.detailAction,
      };
    default:
      return {
        className: styles.statusDefault,
        icon: FileText,
        detailClass: styles.detailDefault,
      };
  }
};

const ServiceCard = ({ service }) => {
  const Icon = service.icon;
  const navigate = useNavigate();

  // mapping from service id + link name to route paths
  const routeMap = {
    civil: {
      'Register a Birth': '/services/birth-status',
      'Register a Death': '/services/death-status',
      'Register a Marriage': '/services/marriage-status',
    },
    vaccination: {
      'View Digital Certificate': '/services/vaccination-records',
    },
    wwcc: {
      'Check Status & Apply': '/services/wwcc-status',
    },
  };

  const onLinkClick = (link) => (e) => {
    e.preventDefault();
    const svc = service.id;
    const target = routeMap[svc] && routeMap[svc][link.name];
    if (target) return navigate(target);
    // fallback: no route mapped — do nothing
  };

  return (
    <div className={styles.serviceCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>{service.title}</h3>
        </div>
        <p className={styles.cardDescription}>{service.description}</p>

        <div className={styles.linkSection}>
          <p className={styles.statusLabel}>Your Current Status</p>
          {service.links.map((link, idx) => {
            const {
              className,
              icon: StatusIcon,
              detailClass,
            } = getStatusClasses(link.status);
            return (
              <a
                key={idx}
                href="#"
                onClick={onLinkClick(link)}
                className={styles.linkItem}
              >
                <div className={styles.linkNameGroup}>
                  <StatusIcon
                    className={`${styles.linkStatusIcon} ${detailClass}`}
                  />
                  <span className={styles.linkName}>{link.name}</span>
                </div>
                <div className={styles.linkDetailGroup}>
                  <span className={`${styles.statusPill} ${className}`}>
                    {link.status}
                  </span>
                  <span
                    className={`${styles.linkDetailText} ${styles.primaryAccentText}`}
                  >
                    {link.detail} &rarr;
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState(SERVICE_DATA);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token || "";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/citizens/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Fetched user data1:", data);
        if (!data.success)
          throw new Error(data.error || "Failed to fetch user data");

        setUserData(data.data); // API returns only logged-in user's data
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch summary and use it to update Identity & Life Events services
  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/api/citizens/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return; // keep UI as-is on failure
        const body = await res.json();
        const summary = body.data || {};

        // Helper to derive status and detail from records — service-specific
  const deriveStatus = (records, opts = {}) => {
          const { dateFields = [], primaryStatusField } = opts;
          if (!Array.isArray(records) || records.length === 0) {
            // No records: show neutral 'Not Started' with actionable hint
            return { status: 'Not Started', detail: 'Start Application' };
          }

          // take latest record
          const latest = records[records.length - 1];
          // If a specific status field exists, use that first
          const approvalRaw = primaryStatusField ? (latest[primaryStatusField] || '') : (latest.approval_status || '');
          const approval = (approvalRaw || '').toString().toLowerCase();
          if (approval === 'approved' || approval === 'complete' || approval === 'completed') return { status: 'Completed', detail: 'Certificate Ready' };
          if (approval === 'rejected' || approval === 'denied') return { status: 'Action Required', detail: 'Application Rejected' };

          // fallback pending: try a list of possible date fields to provide a friendly detail
          const date = dateFields.reduce((acc, f) => acc || latest[f], null) || latest.created_at;
          const d = date ? `Submitted ${new Date(date).toLocaleDateString()}` : 'Submitted';
          return { status: 'Pending', detail: d };
        };

        const newServices = SERVICE_DATA.map(s => {
          if (s.id === 'civil') {
            const birthInfo = deriveStatus(summary.birthRecords, { dateFields: ['registration_date','date_of_birth','created_at'], primaryStatusField: 'approval_status' });
            const deathInfo = deriveStatus(summary.deathRecords, { dateFields: ['registration_date','date_of_death','created_at'], primaryStatusField: 'approval_status' });
            const marriageInfo = deriveStatus(summary.marriageRecords, { dateFields: ['registration_date','marriage_date','created_at'], primaryStatusField: 'approval_status' });
            return {
              ...s,
              links: [
                { name: 'Register a Birth', status: birthInfo.status, detail: birthInfo.detail },
                { name: 'Register a Death', status: deathInfo.status, detail: deathInfo.detail },
                { name: 'Register a Marriage', status: marriageInfo.status, detail: marriageInfo.detail }
              ]
            };
          }

          if (s.id === 'vaccination') {
            const v = Array.isArray(summary.vaccinationRecords) ? summary.vaccinationRecords : [];
            if (v.length === 0) return { ...s, links: [{ name: 'View Digital Certificate', status: 'Not Started', detail: 'No records' }] };
            // if records exist, show latest date or count
            const latest = v[v.length -1];
            const date = latest.administered_at || latest.date_administered || latest.date || latest.created_at;
            const detail = date ? `Last: ${new Date(date).toLocaleDateString()}` : `${v.length} record(s)`;
            return { ...s, links: [{ name: 'View Digital Certificate', status: 'Completed', detail }] };
          }

          if (s.id === 'wwcc') {
            const w = Array.isArray(summary.wwccApplications) ? summary.wwccApplications : [];
            const info = deriveStatus(w, { dateFields: ['applied_at','created_at'], primaryStatusField: 'status' });
            return { ...s, links: [{ name: 'Check Status & Apply', status: info.status, detail: info.detail }] };
          }

          return s;
        });

        setServices(newServices);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    fetchSummary();
  }, [token]);

  const categories = SERVICE_DATA.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Your Personal Service Dashboard</h1>
          <p className={styles.heroSubtitle}>
            Quickly access all government and professional services, track
            applications, and view documents.
          </p>
        </div>
      </div>

      <div className={styles.mainContent}>
        {userData ? (
          <Card className={`${styles.personalInfoCard} mb-4`}>
            <Card.Body>
              <Card.Title as="h2" className={styles.infoTitle}>Personal Information</Card.Title>
              <div className={styles.infoGrid}>
                <p>
                  <strong>Full Name:</strong> {userData.first_name}{" "}
                  {userData.last_name}
                </p>
                <p>
                  <strong>Citizen ID: </strong>
                  {userData.citizen_id}
                </p>{" "}
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {userData.address || "N/A"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {userData.date_of_birth || "N/A"}
                </p>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <p>Loading your information...</p>
        )}

        <div className={styles.categorySectionWrapper}>
          {Object.entries(categories).map(([category, _services]) => (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.serviceGrid}>
                {_services.map((service) => {
                  // pick the updated service definition if it's in our services state
                  const updated = services.find(s => s.id === service.id) || service;
                  return <ServiceCard key={service.id} service={updated} />
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
