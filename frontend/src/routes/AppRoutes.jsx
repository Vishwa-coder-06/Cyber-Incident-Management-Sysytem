import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";


import ForgotPassword from "../pages/public/ForgotPassword";

import Dashboard from "../pages/reporter/Dashboard";
import ReportIncident from "../pages/reporter/ReportIncident";
import AIAnalysis from "../pages/reporter/AIAnalysis";
import MyIncidents from "../pages/reporter/MyIncidents";
import Profile from "../pages/reporter/Profile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

       <Route path="/" element={<Landing />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/login" element={<Login />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Reporter Routes */}
<Route element={<DashboardLayout />}>

    <Route
        path="/dashboard"
        element={<Dashboard />}
    />

    <Route
        path="/report-incident"
        element={<ReportIncident />}
    />

    <Route
        path="/ai-analysis"
        element={<AIAnalysis />}
    />

    <Route
        path="/my-incidents"
        element={<MyIncidents />}
    />

    <Route
        path="/profile"
        element={<Profile />}
    />

</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;