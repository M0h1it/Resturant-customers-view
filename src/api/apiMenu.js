import axios from "axios";

const apiMenu = axios.create({
  baseURL: import.meta.env.VITE_MENU_API_URL, 
  timeout: 15000,
});

export default apiMenu;
