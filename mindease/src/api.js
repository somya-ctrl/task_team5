import axios from "axios";

const API = axios.create({
  baseURL: "https://mindease-backend-cyvy.onrender.com",
});

export const registerUser = (userData) => API.post("/signup", userData);
export const loginUser = (userData) => API.post("/login", userData);
