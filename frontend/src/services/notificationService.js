import api from "../api/axios";

// ─── Notifications ────────────────────────────────────────────────────────────

export const getMyNotifications = async () => {
  const response = await api.get("/api/notifications/me");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/api/notifications/me/unread-count");
  return response.data;
};

export const markAllRead = async () => {
  const response = await api.put("/api/notifications/me/read-all");
  return response.data;
};

export const markOneRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

// ─── Notification Preferences ─────────────────────────────────────────────────

export const getPreferences = async () => {
  const response = await api.get("/api/notifications/preferences/me");
  return response.data;
};

export const updatePreferences = async (preferences) => {
  // preferences: { incidentStatusUpdates, aiAnalysisComplete, assignmentUpdates, systemNotifications }
  const response = await api.put("/api/notifications/preferences/me", preferences);
  return response.data;
};
