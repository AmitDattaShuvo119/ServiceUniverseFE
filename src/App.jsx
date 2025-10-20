import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Navbar from "./components/layout/navbar/Navbar.jsx";
import Footer from "./components/layout/footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollToTop from './components/ScrollTop.jsx';

function App() {
  return (
    <div>
      <ScrollToTop/>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;

