import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useUserStore } from '@/app/store/useUserStore';

let refreshPromise: Promise<boolean> | null = null;

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    accept: 'application/json'
  }
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const tenantId = localStorage.getItem('tenantId');
    const lang = localStorage.getItem('lang');
    const language = lang === 'en' ? 'en-US' : 'ar-SA';

    if (!config.headers) {
      config.headers = {};
    }

    config.headers['Accept-language'] = language;

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
async function makeRequest<T = any>(
  method: AxiosRequestConfig['method'],
  url: string,
  data: any = null,
  config: AxiosRequestConfig = {},
  returnAll = false
): Promise<T | AxiosResponse<T>> {
  try {
    const response = await instance.request<T>({
      method,
      url,
      data,
      ...config
    });

    return returnAll ? response : response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (!error.response) throw error;

    const status = error.response.status;

    // -----------------------------
    // 401 HANDLING + TOKEN REFRESH
    // -----------------------------
    if (status === 401) {
      if (url === '/Users/refresh') {
        const userStore = useUserStore();
        userStore.logout();
        return Promise.reject('Session expired');
      }

      if (!refreshPromise) {
        // refreshPromise = store.dispatch('refreshToken').finally(() => {
        //   refreshPromise = null;
        // });
      }

      const refreshSuccess = await refreshPromise;

      if (refreshSuccess) {
        return await makeRequest<T>(method, url, data, config, returnAll);
      } else {
        const userStore = useUserStore();
        userStore.logout();
        return Promise.reject('Session expired');
      }
    }

    // -----------------------------
    // NORMAL ERROR RETURN
    // -----------------------------
    if (returnAll) {
      return Promise.reject(error.response.data ?? error);
    }

    const message =
      (error.response.data as any)?.message || error.message;
    return Promise.reject(message);
  }
}

// -----------------------------
// PUBLIC WRAPPER METHODS
// -----------------------------
const axiosWrapper = {
  get<T = any>(url: string, config: AxiosRequestConfig = {}, returnAll = false) {
    return makeRequest<T>('get', url, null, config, returnAll);
  },

  post<T = any>(url: string, data: any, config: AxiosRequestConfig = {}, returnAll = false) {
    return makeRequest<T>('post', url, data, config, returnAll);
  },

  put<T = any>(url: string, data: any, config: AxiosRequestConfig = {}, returnAll = false) {
    return makeRequest<T>('put', url, data, config, returnAll);
  },

  delete<T = any>(url: string, config: AxiosRequestConfig = {}, returnAll = false) {
    return makeRequest<T>('delete', url, null, config, returnAll);
  }
};

export default axiosWrapper;
