// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api',
  ENDPOINTS: {
    CITIES: '/cities/all',
    AIRPORTS: '/airports',
    HUBS: '/locations',
    VEHICLES: '/vehicles',
    ADDONS: '/addons',
    BOOKINGS: '/bookings',
    AUTH: '/auth'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 