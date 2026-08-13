import api from "../api/axios";

// ─── Assignments ──────────────────────────────────────────────────────────────

export const createAssignment = async (assignmentData) => {
  // assignmentData: { incidentId, analystId, managerId, status }
  const response = await api.post("/api/assignments", assignmentData);
  return response.data;
};

export const getAllAssignments = async () => {
  const response = await api.get("/api/assignments");
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/api/assignments/${id}`);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await api.put(`/api/assignments/${id}`, assignmentData);
  return response.data;
};

export const updateAssignmentStatus = async (id, status) => {
  const response = await api.put(`/api/assignments/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};

// ─── Analyst Dashboard ────────────────────────────────────────────────────────

export const getAnalystDashboard = async (analystId) => {
  // Returns: { assignedToYou, resolvedThisWeek, averageResolutionTime,
  //            activeIncidents[], recentKbArticles[] }
  const response = await api.get(`/api/assignments/analyst/dashboard/${analystId}`);
  return response.data;
};

// ─── Manager Dashboard ────────────────────────────────────────────────────────

export const getManagerDashboard = async () => {
  // Returns: { openIncidents, mttr, resolvedToday, analystWorkload[], unassignedIncidents[] }
  const response = await api.get("/api/assignments/manager/dashboard");
  return response.data;
};
