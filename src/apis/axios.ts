import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustominternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000',
  // 필요에 따라 v1을 포함하셔도 됩니다
  baseURL: "https://umc-web.kyeoungwoon.kr/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// accessToken을 자동으로 헤더에 포함시키는 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem(); //localStorage에서 토큰을 가져옴

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // 수정된 config 객체를 반환
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustominternalAxiosRequestConfig = error.config;

    // 401 에러이면서, 재시도된 요청이 아닌 경우에만 토큰 갱신 시도
    if (
      error.response &&
      error.response?.status === 401 &&
      !originalRequest.retry
    ) {
      // refresh endpoint 401 에러가 발생한 경우 (Unauthorized), 로그아웃 처리
      if (originalRequest.url === "/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest.retry = true;

      if (!refreshPromise) {
        // refresh 요청 실행 후, 프러미스를 전역 변수에 할당.
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("/auth/refresh", {
            refresh: refreshToken,
          });
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);
          return data.data.accessToken;
        })()
          .catch((error) => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );
            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      //진행 중인 refresh 프러미스가 있으면, 해당 프러미스가 해결될 때까지 대기
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }
  }
);
