import api from "../api/axios";

// ─── Current User ─────────────────────────────────────────────────────────────

export const getMe = async () => {
  const response = await api.get("/api/users/me");
  return response.data;
};

export const updateMe = async (userData) => {
  const response = await api.put("/api/users/me", userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/api/users/me/password", passwordData);
  return response.data;
};

export const uploadMyPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/api/users/me/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProfileStats = async () => {
  const response = await api.get("/api/dashboard/profile/stats");
  return response.data;
};

// ─── Admin - User Management ──────────────────────────────────────────────────

export const getAllUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

export const searchUsers = async (keyword) => {
  const response = await api.get("/api/admin/users/search", { params: { keyword } });
  return response.data;
};

export const createUser = async (userData) => {
  // userData: { firstName, lastName, email, password, role, department, phone }
  const response = await api.post("/api/admin/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

// ─── Role-based User Lists ────────────────────────────────────────────────────

export const getUsersByRole = async (role) => {
  const response = await api.get(`/api/users/role/${role}`);
  return response.data;
};

export const getAnalysts = async () => {
  return getUsersByRole("ANALYST");
};

// ─── User Stats (Admin Dashboard) ────────────────────────────────────────────

export const getUserDashboard = async () => {
  const response = await api.get("/api/users/dashboard");
  return response.data;
};

// ─── User by ID ───────────────────────────────────────────────────────────────

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};
