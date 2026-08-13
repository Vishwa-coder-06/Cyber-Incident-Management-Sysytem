import api from "../api/axios";

// ─── Reporter ────────────────────────────────────────────────────────────────

export const getMyIncidents = async (params = {}) => {
  const response = await api.get("/api/incidents/reporter/my", { params });
  return response.data;
};

export const getReporterDashboard = async (userId) => {
  const response = await api.get(`/api/incidents/reporter/dashboard/${userId}`);
  return response.data;
};

export const submitIncident = async (incidentData) => {
  const response = await api.post("/api/incidents/reporter/submit", incidentData);
  return response.data;
};

export const saveDraftIncident = async (incidentData) => {
  const response = await api.post("/api/incidents/reporter/draft", incidentData);
  return response.data;
};

export const getReporterIncidentDetails = async (id) => {
  const response = await api.get(`/api/incidents/${id}/reporter-details`);
  return response.data;
};

// ─── AI Analysis ─────────────────────────────────────────────────────────────

export const triggerAnalysis = async (id) => {
  const response = await api.post(`/api/incidents/${id}/analyze`);
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await api.get(`/api/incidents/${id}/analysis`);
  return response.data;
};

// ─── Analyst ─────────────────────────────────────────────────────────────────

export const getAnalystIncidents = async (params = {}) => {
  const response = await api.get("/api/incidents/analyst/my", { params });
  return response.data;
};

export const getInvestigation = async (id) => {
  const response = await api.get(`/api/incidents/${id}/investigation`);
  return response.data;
};

export const addInvestigationNote = async (id, note) => {
  const response = await api.post(`/api/incidents/${id}/investigation/note`, { note });
  return response.data;
};

export const doInvestigationAction = async (id, action) => {
  const response = await api.post(`/api/incidents/${id}/investigation/action`, null, {
    params: { action },
  });
  return response.data;
};

export const closeIncident = async (id, payload) => {
  // payload: { resolutionSummary, articleTitle, tags, generateKnowledgeArticle }
  const response = await api.post(`/api/incidents/${id}/resolution/close`, payload);
  return response.data;
};

// ─── Manager ─────────────────────────────────────────────────────────────────

export const getManagerQueue = async (params = {}) => {
  const response = await api.get("/api/incidents/manager/queue", { params });
  return response.data;
};

export const getManagerOpenCount = async () => {
  const response = await api.get("/api/incidents/manager/open-count");
  return response.data;
};

export const getManagerResolvedToday = async () => {
  const response = await api.get("/api/incidents/manager/resolved-today");
  return response.data;
};

export const getUnassignedIncidents = async () => {
  const response = await api.get("/api/incidents/manager/unassigned");
  return response.data;
};

// ─── Admin / Reports ──────────────────────────────────────────────────────────

export const getAdminReports = async () => {
  const response = await api.get("/api/incidents/reports");
  return response.data;
};

export const getIncidentTrend = async () => {
  const response = await api.get("/api/incidents/dashboard/trend");
  return response.data;
};

export const getIncidentDashboard = async () => {
  const response = await api.get("/api/incidents/dashboard");
  return response.data;
};

// ─── Generic ──────────────────────────────────────────────────────────────────

export const getIncidentById = async (id) => {
  const response = await api.get(`/api/incidents/${id}`);
  return response.data;
};

export const updateIncidentStatus = async (id, status) => {
  const response = await api.put(`/api/incidents/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};
