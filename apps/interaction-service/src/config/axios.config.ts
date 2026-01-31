import { ApiClient } from '@libs/axios';
import { API_CONFIG } from './api.config';

ApiClient.init({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  key: API_CONFIG.key,
});

export default ApiClient;