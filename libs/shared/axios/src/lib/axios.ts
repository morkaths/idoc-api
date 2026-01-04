import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  key?: string;
}

export type ApiMode = 'public' | 'private';

export type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & { mode?: ApiMode };

export class ApiClient {
  private static instances: { public: AxiosInstance; private: AxiosInstance };
  private static token: string | null = null;
  private static config: ApiConfig;

  static setToken(token: string | null) {
    ApiClient.token = token;
  }

  static init(config: ApiConfig) {
    ApiClient.config = config;
    if (!ApiClient.instances) {
      ApiClient.instances = {
        public: ApiClient.createInstance(false),
        private: ApiClient.createInstance(true),
      };
    }
  }

  private static createInstance(withCredentials = false): AxiosInstance {
    if (!ApiClient.config) {
      throw new Error("ApiClient must be initialized with config before creating instances");
    }
    const instance = axios.create({
      baseURL: ApiClient.config.baseURL,
      timeout: ApiClient.config.timeout,
      withCredentials,
    });

    instance.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      if (ApiClient.config.key) {
        config.headers['x-api-key'] = ApiClient.config.key;
      }
      if (withCredentials && ApiClient.token) {
        config.headers['Authorization'] = `Bearer ${ApiClient.token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => Promise.reject(ApiClient.handleError(error))
    );

    return instance;
  }

  private static getInstance(mode: ApiMode): AxiosInstance {
    if (!ApiClient.instances) {
      if (ApiClient.config) {
        ApiClient.init(ApiClient.config);
      } else {
        throw new Error("ApiClient not initialized. Call init(config) first.");
      }
    }
    return ApiClient.instances[mode];
  }

  private static handleError(error: any): ApiResponse<any> {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
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
