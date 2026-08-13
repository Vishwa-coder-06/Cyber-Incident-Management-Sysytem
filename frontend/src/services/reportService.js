import api from "../api/axios";

// ─── Admin Reports ────────────────────────────────────────────────────────────

export const getAdminReport = async () => {
  // Returns AdminReportResponse:
  // { mttdHours, mttrHours, incidentsThisMonth, repeatIncidents,
  //   critical, high, medium, low, topAffectedSystems[] }
  const response = await api.get("/api/dashboard/admin/reports");
  return response.data;
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const getAuditLogs = async () => {
  const response = await api.get("/api/admin/audits");
  return response.data;
};

export const searchAuditLogs = async (keyword) => {
  const response = await api.get("/api/admin/audits/search", { params: { keyword } });
  return response.data;
};

export const getAuditLogsByAction = async (action) => {
  const response = await api.get(`/api/admin/audits/action/${action}`);
  return response.data;
};

// ─── System Settings ──────────────────────────────────────────────────────────

export const getSettings = async () => {
  const response = await api.get("/api/admin/settings");
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await api.put("/api/admin/settings", settingsData);
  return response.data;
};
