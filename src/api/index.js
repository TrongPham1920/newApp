import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 30000,
});

//Request interceptors
api.interceptors.request.use(
  (config) => {
    //Get Tokens
    const token = localStorage.getItem("token");
    //If there is a token ?
    if (token) {
      //Request headers
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Response interceptors
api.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 403) {
      if (!!localStorage.getItem("token")) {
        localStorage.removeItem("token");
        window.location.href = "/sign-in"; //relative to domain
      }
    }
    return Promise.resolve(error?.response?.data);
  }
);

export default api;
