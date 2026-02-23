import { Notify } from "@/lib/notify";
import axios from "axios";

export const api = axios.create({
  // baseURL: "http://192.168.200.103:8080",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@cms_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensagemDeErro = error.response.data.mensagem;

    if (status === 401 || status === 403) {
      Notify.error(mensagemDeErro || "Sessão expirada. Faça login novamente.");

      localStorage.removeItem("@cms_token");
      localStorage.removeItem("@cms_user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }

    if (!error.response) {
      Notify.error("Erro de conexão com o servidor.");
    }

    return Promise.reject(error);
  }
);