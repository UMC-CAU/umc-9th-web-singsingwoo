import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000',
  // 필요에 따라 v1을 포함하셔도 됩니다
  baseURL: "https://umc-web.kyeoungwoon.kr/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
