import api from "../api/axios";

/**
 * Analyze an incident using the AI service.
 * POST /api/ai/analyze
 *
 * @param {object} incidentData - { incidentDescription, title, category, severity }
 * @returns {Promise<{attackType, severity, recommendation, rootCause, immediateAdvice, recommendedPlaybookTitle}>}
 */
export const analyzeIncident = async (incidentData) => {
  const response = await api.post("/api/ai/analyze", incidentData);
  return response.data;
};
