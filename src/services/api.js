import axios from "axios";

let token = "";

if (typeof window !== "undefined") {
  token = localStorage.getItem("ACCESS_TOKEN") ?? "";
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_HOSTNAME_BACKEND,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data.access_token) {
      localStorage.setItem("ACCESS_TOKEN", response.data.access_token);
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401 && !token) {
      if (error.response.data.error === "Access denied") {
        window.location.href = "/login";
      } else if (error.response.data.message === "Email or password incorrect") {
        window.alert("Senha ou email incorretos");
      }
    }
    
    
    return Promise.reject(error);
  }
);
