import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000',
  // 필요에 따라 v1을 포함하셔도 됩니다
  baseURL: "https://umc-web.kyeoungwoon.kr/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
