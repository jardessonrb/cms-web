import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.200.103:8080",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@cms_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
