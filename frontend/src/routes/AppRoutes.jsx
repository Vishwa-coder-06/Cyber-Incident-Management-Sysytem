import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReporterLayout from "../layouts/ReporterLayout";
import AnalystLayout from "../layouts/AnalystLayout";

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
import IncidentDetails from "../pages/reporter/IncidentDetails";
import Notifications from "../pages/reporter/Notifications";

import AnalystDashboard from "../pages/analyst/AnalystDashboard";

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
<Route element={<ReporterLayout />}>
    <Route path="/reporter/dashboard" element={<Dashboard />} />
    <Route path="/reporter/report-incident" element={<ReportIncident />} />
    <Route path="/reporter/ai-analysis" element={<AIAnalysis />} />
    <Route path="/reporter/my-incidents" element={<MyIncidents />} />
    <Route path="/reporter/incident-details" element={<IncidentDetails />} />
    <Route path="/reporter/notifications" element={<Notifications />} />
    <Route path="/reporter/profile" element={<Profile />}  />
</Route>
<Route element={<AnalystLayout />}>
    <Route path="/analyst/dashboard" element={<AnalystDashboard/>} />
  {/*<Route path="/analyst/assigned-incidents" element={<AssignedIncidents />} />
    <Route path="/analyst/investigation" element={<Investigation />} />
    <Route path="/analyst/resolution" element={<Resolution />} />
    <Route path="/analyst/knowledgde-base" element={<KnowledgeBase />} />
    <Route path="/analyst/article-view" element={<ArticleView />} />
    <Route path="/analyst/profile" element={<AnalystProfile />} />*/}
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;