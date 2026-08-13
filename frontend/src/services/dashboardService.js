import api from "../api/axios";

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export const getAdminDashboard = async () => {
  // Returns: { totalUsers, activePlaybooks, kbArticles, auditCount,
  //            incidentTrend[], recentAudits[] }
  const response = await api.get("/api/dashboard/admin");
  return response.data;
};

// ─── Reporter Dashboard ───────────────────────────────────────────────────────

export const getReporterDashboard = async (userId) => {
  // Returns: ReporterDashboardResponse
  const response = await api.get(`/api/dashboard/reporter/${userId}`);
  return response.data;
};

// ─── Manager Dashboard ────────────────────────────────────────────────────────

export const getManagerDashboardGateway = async () => {
  // Proxied from assignment-service manager dashboard
  const response = await api.get("/api/dashboard/manager");
  return response.data;
};

// ─── Manager Assignment Page ──────────────────────────────────────────────────

export const getAssignmentPageData = async (incidentId) => {
  // Returns: { incident, analysts[], recommendedAnalyst }
  // Try assignment-service path first, fallback to dashboard path
  const response = await api.get(`/api/dashboard/manager/assign/${incidentId}`);
  return response.data;
};

// ─── Manager Workload ─────────────────────────────────────────────────────────

export const getManagerWorkload = async () => {
  // Returns: { totalAnalysts, averageWorkload, analysts[] }
  const response = await api.get("/api/dashboard/manager/workload");
  return response.data;
};
