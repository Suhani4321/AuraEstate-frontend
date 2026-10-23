import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to measure client-side roundtrip time and extract server performance headers
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() };
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const clientDuration = performance.now() - response.config.metadata.startTime;
    const serverDuration = response.headers['x-response-time-ms'] 
      ? parseFloat(response.headers['x-response-time-ms']) 
      : null;
    const dbQueries = response.headers['x-db-queries'] 
      ? parseInt(response.headers['x-db-queries'], 10) 
      : null;

    response.metrics = {
      clientDurationMs: Math.round(clientDuration * 10) / 10,
      serverDurationMs: serverDuration,
      dbQueries: dbQueries,
    };

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const propertyService = {
  async getProperties(params = {}) {
    const response = await apiClient.get('/properties/', { params });
    return {
      results: response.data.results || response.data,
      count: response.data.count || (response.data.results ? response.data.results.length : response.data.length),
      next: response.data.next,
      previous: response.data.previous,
      metrics: response.metrics,
    };
  },

  async getPropertyById(id) {
    const response = await apiClient.get(`/properties/${id}/`);
    return {
      data: response.data,
      metrics: response.metrics,
    };
  },

  async getFeaturedProperties() {
    const response = await apiClient.get('/properties/featured/');
    return response.data;
  },

  async getMetadata() {
    const response = await apiClient.get('/properties/meta/');
    return response.data;
  },

  async sendInquiry(inquiryData) {
    const response = await apiClient.post('/properties/inquiry/', inquiryData);
    return response.data;
  },
};

export default apiClient;
