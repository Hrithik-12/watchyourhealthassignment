// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/auth/register`,
      login: `${API_BASE_URL}/auth/login`,
      profile: `${API_BASE_URL}/auth/profile`,
    },
    reports: {
      generateDownload: `${API_BASE_URL}/generate-report-download`,
      generatePreview: `${API_BASE_URL}/generate-report-preview`,
    },
    health: `${API_BASE_URL}/health`,
  }
};

export default apiConfig;
