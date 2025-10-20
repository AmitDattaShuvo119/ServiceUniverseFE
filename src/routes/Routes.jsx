import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TaxEstimator from "../pages/TaxEstimator";
import WWCC from "../pages/WWCC";
import WWCC_form from "../pages/WWCC_form";
import WWCC_feedback from "../pages/WWCC_feedback";
import WWCC_appStatus from "../pages/WWCC_appStatus";
import Landing from "../pages/Landing";
import Services from "../pages/Services";
import CivilRegistration from "../pages/CivilRegistration";
import BirthRegistrationForm from "../pages/BitrhRegistrationForm";
import BirthRegistration from "../pages/BirthRegistration";
import Birth_feedback from "../pages/Birth_feedback";
import DeathRegistrationForm from "../pages/DeathRegistrationForm";
import DeathRegistration from "../pages/DeathRegistration";
import MarriageRegistration from "../pages/MarriageRegistration";
import MarriageRegistrationForm from "../pages/MarriageRegistrationForm";
import AddVaccinationRecord from "../pages/AddVaccinationRecordForm";
import UserDashboard from "../pages/UserDashboard";
import VaccinationRecords from "../pages/VccinationRecords";
import Login_Admin from "../pages/Login_Admin";
import Admin_appStatus from "../pages/Admin_appStatus";
import ViewWWCCApp from "../pages/ViewWWCCApp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "tax-estimator",
        element: <TaxEstimator />,
      },
      {
        path: "services/wwcc",
        element: <WWCC />,
      },
      {
        path: "services/wwcc-form",
        element: <WWCC_form />,
      },
      {
        path: "services/wwcc-status",
        element: <WWCC_appStatus />,
      },
      {
        path: "services/wwcc-feedback",
        element: <WWCC_feedback />,
      },
      {
        path: "landing",
        element: <Landing />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "services/births-deaths-marriages",
        element: <CivilRegistration />,
      },
      {
        path: "services/birth-registration",
        element: <BirthRegistration />,
      },
      {
        path: "services/birth-registration-form",
        element: <BirthRegistrationForm />,
      },
      {
        path: "services/birth-feedback",
        element: <Birth_feedback />,
      },
      {
        path: "services/death-registration",
        element: <DeathRegistration />,
      },
      {
        path: "services/death-registration-form",
        element: <DeathRegistrationForm />,
      },
      {
        path: "services/marriage-registration",
        element: <MarriageRegistration />,
      },
      {
        path: "services/marriage-registration-form",
        element: <MarriageRegistrationForm />,
      },
      {
        path: "services/add-vaccination-record",
        element: <AddVaccinationRecord />,
      },
      {
        path: "services/vaccination-records",
        element: <VaccinationRecords />,
      },
      {
        path: "user-dashboard",
        element: <UserDashboard />,
      },
      {
        path: "admin-login",
        element: <Login_Admin />,
      },
      {
        path: "admin-applications",
        element: <Admin_appStatus />,
      },
      {
        path: "view-wwccApp/:id",
        element: <ViewWWCCApp />,
      },
    ],
  },
]);
