import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse } from 'src/types';
import { API_CONFIG } from './api.config';

type ApiMode = 'public' | 'private';
type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & { mode?: ApiMode };

class ApiClient {
  private static instances: { public: AxiosInstance; private: AxiosInstance };

  static init() {
    if (!ApiClient.instances) {
      ApiClient.instances = {
        public: ApiClient.createInstance(false),
        private: ApiClient.createInstance(true),
      };
    }
  }

  private static createInstance(withCredentials = false): AxiosInstance {
    const instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      withCredentials,
    });

    instance.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers['x-api-key'] = API_CONFIG.key;
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => Promise.reject(ApiClient.handleError(error))
    );

    return instance;
  }

  private static getInstance(mode: ApiMode): AxiosInstance {
    if (!ApiClient.instances) ApiClient.init();
    return ApiClient.instances[mode];
  }

  private static handleError(error: any): ApiResponse<any> {
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }

  static async request<T>(
    method: AxiosRequestConfig['method'],
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { mode = 'private', ...axiosOptions } = options;
    try {
      const api = ApiClient.getInstance(mode);
      const response = await api.request<ApiResponse<T>>({
        method,
        url,
        ...axiosOptions,
      });
      return response.data;
    } catch (error: any) {
      return ApiClient.handleError(error);
    }
  }

  static get<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('get', url, options);
  }

  static post<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('post', url, options);
  }

  static put<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('put', url, options);
  }

  static delete<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('delete', url, options);
  }
}

export default ApiClient;