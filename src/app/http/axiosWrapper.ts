import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from 'axios';
import { useUserStore } from '@/app/store/useUserStore';
import { useLoadingStore } from "@/app/store/useLoadingStore";

let refreshPromise: Promise<boolean> | null = null;

// -----------------------------
// AXIOS INSTANCE
// -----------------------------
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const tenantId = localStorage.getItem('tenantId');
    const lang = localStorage.getItem('lang');
    const language = lang === 'en' ? 'en-US' : 'ar-SA';

    config.headers = config.headers ?? {};

    config.headers['Accept-Language'] = language;

    if (tenantId) {
      config.headers['X-TenantId'] = tenantId;
    }

    const userStore = useUserStore();
    const token = userStore.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// MAIN REQUEST HANDLER
// -----------------------------
async function makeRequest<T>(
  method: AxiosRequestConfig['method'],
  url: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const loadingStore = useLoadingStore();
  try {
    loadingStore.start();
    const response = await instance.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;

    if (!error.response) {
      throw error;
    }

    const status = error.response.status;
    const userStore = useUserStore();
    const message =
      error.response.data?.message || error.message;
    // -----------------------------
    // 401 HANDLING + TOKEN REFRESH
    // -----------------------------
    if (status === 401) {
      if (url === '/Auth/refresh-token') {
        userStore.logout();
        return Promise.reject(message);
      }

      if (!refreshPromise && userStore.isAuthenticated) {
        refreshPromise = userStore.refreshTokenAction().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshSuccess = await refreshPromise;

      if (refreshSuccess) {
        return makeRequest<T>(method, url, data, config);
      }

      userStore.logout();
      return Promise.reject(message);
    }

    // -----------------------------
    // NORMAL ERROR
    // -----------------------------
    

    return Promise.reject(message);
  } finally {
    loadingStore.stop();
  }
}

// -----------------------------
// PUBLIC WRAPPER METHODS
// -----------------------------
const axiosWrapper = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return makeRequest<T>('get', url, null, config);
  },

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return makeRequest<T>('post', url, data, config);
  },

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return makeRequest<T>('put', url, data, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return makeRequest<T>('delete', url, null, config);
  },
};

export default axiosWrapper;
