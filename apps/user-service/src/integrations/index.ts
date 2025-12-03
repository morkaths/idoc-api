import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from 'src/types';
import { API_CONFIG } from 'src/config/api.config';
import { API_KEY } from 'src/config/env.config';

// ────────────────────────────────────────────────────────────────────────────────
// API Instances
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Service name (key in api.config)
 */
type ApiService = keyof typeof API_CONFIG.baseURLs;
/**
 * Request mode (public/private)
 * - public: no authentication
 * - private: with authentication (e.g., JWT token in headers)
 */
type ApiMode = keyof (typeof apiInstances)[ApiService];

/**
 * Create an Axios instance
 * @param baseURL - Base URL for the service
 * @param withCredentials - Whether to send cookies with requests
 * @returns AxiosInstance
 */
function createApiInstance(baseURL: string, withCredentials = false) {
  const instance = axios.create({
    baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials
  });

  instance.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['x-api-key'] = API_KEY;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(handleError(error))
  );

  return instance;
}

/**
 * Create Axios instances for each service and mode
 */
const apiInstances = Object.fromEntries(
  Object.entries(API_CONFIG.baseURLs).map(([service, baseURL]) => [
    service,
    {
      public: createApiInstance(baseURL, false),
      private: createApiInstance(baseURL, true),
    }
  ])
) as Record<
  keyof typeof API_CONFIG.baseURLs,
  { public: AxiosInstance; private: AxiosInstance }
>;

/**
 * Get the appropriate Axios instance based on service and mode
 * @param service - Service name (key in api.config)
 * @param mode - Request mode (public/private)
 * @returns AxiosInstance
 */
function getApiInstance(service: ApiService, mode: ApiMode): AxiosInstance {
  return apiInstances[service][mode];
}

// ────────────────────────────────────────────────────────────────────────────────
// Common Helpers
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Handle API errors
 * @param error - Error object
 * @returns ApiResponse with error details
 */
function handleError(error: any): ApiResponse<any> {
  return {
    success: false,
    message: error.response?.data?.message,
    statusCode: error.response?.status || 500
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// API Methods
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Options for API requests
 */
type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & { mode?: ApiMode };

/**
 * Make an API request
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param service - Service name (key in api.config)
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, data, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
async function apiRequest<T>(
  method: AxiosRequestConfig['method'],
  service: ApiService,
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { mode = 'private', ...axiosOptions } = options;
  try {
    const api = getApiInstance(service, mode);
    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      ...axiosOptions
    });
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
}

/**
 * Make a GET request
 * @param service - Service name
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
const apiGet = <T>(service: ApiService, url: string, options?: ApiOptions) =>
  apiRequest<T>('get', service, url, options);

/**
 * Make a POST request
 * @param service - Service name
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, data, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
const apiPost = <T>(service: ApiService, url: string, options?: ApiOptions) =>
  apiRequest<T>('post', service, url, options);

/**
 * Make a PUT request
 * @param service - Service name
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, data, etc.)
 * @returns - Promise resolving to ApiResponse<T>
 */
const apiPut = <T>(service: ApiService, url: string, options?: ApiOptions) =>
  apiRequest<T>('put', service, url, options);

/**
 * Make a DELETE request
 * @param service - Service name
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, etc.)
 * @returns - Promise resolving to ApiResponse<T>
 */
const apiDelete = <T>(service: ApiService, url: string, options?: ApiOptions) =>
  apiRequest<T>('delete', service, url, options);

export {
  type ApiService,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};
