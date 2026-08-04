import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReporterLayout from "../layouts/ReporterLayout";
import AnalystLayout from "../layouts/AnalystLayout";
import AdminLayout from "../layouts/AdminLayout";

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
import AssignedIncidents from "../pages/analyst/AssignedIncidents";
import Investigation from "../pages/analyst/Investigation";
import Resolution from "../pages/analyst/Resolution";
import KnowledgeBase from "../pages/analyst/KnowledgeBase";
import ArticleView from "../pages/analyst/ArticleView";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import Playbooks from "../pages/admin/Playbooks";
import KnowledgeBaseMgmt from "../pages/admin/KnowledgeBaseMgmt";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";
import Settings from "../pages/admin/Settings";

import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import IncidentQueue from "../pages/manager/IncidentQueue";
import AssignIncident from "../pages/manager/AssignIncident";
import Workload from "../pages/manager/Workload";



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
    <Route path="/analyst/assigned-incidents" element={<AssignedIncidents />} />
    <Route path="/analyst/investigation" element={<Investigation />} />
    <Route path="/analyst/resolution" element={<Resolution />} />
    <Route path="/analyst/knowledge-base" element={<KnowledgeBase />} />
    <Route path="/analyst/article-view" element={<ArticleView />} />
    {/*<Route path="/analyst/profile" element={<AnalystProfile />} />*/}
</Route>

<Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/user-management" element={<UserManagement />} />
    <Route path="/admin/playbooks" element={<Playbooks />} />
    <Route path="/admin/knowledge-base-mgmt" element={<KnowledgeBaseMgmt />} />
    <Route path="/admin/reports" element={<Reports />} />
    <Route path="/admin/audit-logs" element={<AuditLogs />} />
    <Route path="/admin/settings" element={<Settings />} />

    {/*<Route path="/analyst/profile" element={<AnalystProfile />} />*/}
</Route>

<Route element={<ManagerLayout />}>
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/manager/incident-queue" element={<IncidentQueue />} />
      <Route path="/manager/assign-incident" element={<AssignIncident />} />
      <Route path="/manager/workload" element={<Workload />} />

</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;