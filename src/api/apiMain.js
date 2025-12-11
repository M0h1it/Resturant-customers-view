import axios from "axios";

const apiMain = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default apiMain;
