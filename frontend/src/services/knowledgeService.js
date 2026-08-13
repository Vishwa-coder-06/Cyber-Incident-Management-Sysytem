import api from "../api/axios";

// ─── Articles ─────────────────────────────────────────────────────────────────

export const getArticles = async () => {
  const response = await api.get("/api/articles");
  return response.data;
};

export const filterArticles = async (params = {}) => {
  // params: { search, category }
  const response = await api.get("/api/articles/filter", { params });
  return response.data;
};

export const getArticleById = async (id) => {
  const response = await api.get(`/api/articles/${id}`);
  return response.data;
};

export const getRecentArticles = async () => {
  const response = await api.get("/api/articles/recent");
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await api.post("/api/articles", articleData);
  return response.data;
};

export const updateArticle = async (id, articleData) => {
  const response = await api.put(`/api/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await api.delete(`/api/articles/${id}`);
  return response.data;
};

export const searchArticles = async (keyword) => {
  const response = await api.get("/api/articles/search", { params: { keyword } });
  return response.data;
};

export const getArticlesByCategory = async (category) => {
  const response = await api.get(`/api/articles/category/${category}`);
  return response.data;
};

export const getArticlesByStatus = async (status) => {
  const response = await api.get(`/api/articles/status/${status}`);
  return response.data;
};

// ─── Article Stats ────────────────────────────────────────────────────────────

export const getTotalArticles = async () => {
  const response = await api.get("/api/articles/stats/total");
  return response.data;
};

export const getPublishedArticles = async () => {
  const response = await api.get("/api/articles/stats/published");
  return response.data;
};

export const getDraftArticles = async () => {
  const response = await api.get("/api/articles/stats/drafts");
  return response.data;
};

// ─── Playbooks ────────────────────────────────────────────────────────────────

export const getPlaybooks = async () => {
  const response = await api.get("/api/articles/playbooks");
  return response.data;
};

export const getActivePlaybooksCount = async () => {
  const response = await api.get("/api/articles/playbooks/active/count");
  return response.data;
};

export const getPlaybookById = async (id) => {
  const response = await api.get(`/api/articles/playbooks/${id}`);
  return response.data;
};

export const createPlaybook = async (playbookData) => {
  const response = await api.post("/api/articles/playbooks", playbookData);
  return response.data;
};

export const updatePlaybook = async (id, playbookData) => {
  const response = await api.put(`/api/articles/playbooks/${id}`, playbookData);
  return response.data;
};

export const deletePlaybook = async (id) => {
  const response = await api.delete(`/api/articles/playbooks/${id}`);
  return response.data;
};

export const searchPlaybooks = async (keyword) => {
  const response = await api.get("/api/articles/playbooks/search", { params: { keyword } });
  return response.data;
};

export const getPlaybooksByCategory = async (category) => {
  const response = await api.get(`/api/articles/playbooks/category/${category}`);
  return response.data;
};
