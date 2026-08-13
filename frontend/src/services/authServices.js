import api from "../api/axios";

export const loginUser = async (email, password) => {

  console.log("AUTH SERVICE CALLED");

  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  console.log("AUTH SERVICE RESPONSE:", response.data);

  return response.data;
};