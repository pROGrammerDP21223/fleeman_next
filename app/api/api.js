// Comprehensive API service for the car rental application
import { API_CONFIG, getApiUrl } from '../config/api';
import { transformLocationApiResponseToHubs } from '../_components/utils/dataTransform';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function to check if API is available
function checkApiAvailability() {
  if (!API_CONFIG.BASE_URL) {
    throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.');
  }
}

// Helper function to get auth token from cookies
function getAuthToken() {
  if (typeof document === 'undefined') return null; // Server-side check
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
}

// Helper function to create headers with auth token
function createAuthHeaders(additionalHeaders = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleApiResponse(response, errorMessage = 'API request failed') {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorMessage);
  }
  return response.json();
}

// ============================================================================
// LOCATION & DATA API CALLS
// ============================================================================

// Fetch cities data
export async function fetchCities() {
  checkApiAvailability();
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CITIES));
  return handleApiResponse(response, 'Failed to fetch cities');
}

// Fetch airports data
export async function fetchAirports() {
  checkApiAvailability();
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AIRPORTS));
  return handleApiResponse(response, 'Failed to fetch airports');
}

// Fetch hubs based on location type and value
export const fetchHubs = async (type, value) => {
  checkApiAvailability();
  const url = getApiUrl(`${API_CONFIG.ENDPOINTS.HUBS}/${type}/${encodeURIComponent(value)}`);
  const response = await fetch(url, {
    method: "GET",
    headers: createAuthHeaders(),
  });
  const apiResponse = await handleApiResponse(response, 'Failed to fetch hubs');
  // Transform the response here:
  return transformLocationApiResponseToHubs(apiResponse);
};

// ============================================================================
// VEHICLE & ADDON API CALLS
// ============================================================================

// Fetch available vehicles
export const fetchVehicles = async () => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VEHICLES));
  return handleApiResponse(response, 'Failed to fetch vehicles');
};

// Fetch available add-ons
export const fetchAddons = async () => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADDONS));
  return handleApiResponse(response, 'Failed to fetch add-ons');
};

// ============================================================================
// BOOKING API CALLS
// ============================================================================

// Create a new booking
export const createBooking = async (bookingData) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl('/booking-details/create-booking'), {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  return handleApiResponse(response, 'Failed to create booking');
};

// Get all bookings (admin/public)
export const getBookings = async () => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS));
  return handleApiResponse(response, 'Failed to fetch bookings');
};

// Get user's booking history (protected)
export const getUserBookingHistory = async () => {
  checkApiAvailability();
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to view booking history');
  }
  
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/user/history`), {
    method: 'GET',
    headers: createAuthHeaders(),
  });
  return handleApiResponse(response, 'Failed to fetch booking history');
};

// Get specific booking by ID
export const getBookingById = async (bookingId) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}`));
  return handleApiResponse(response, 'Failed to fetch booking');
};

// Update existing booking
export const updateBooking = async (id, bookingData) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`), {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  return handleApiResponse(response, 'Failed to update booking');
};

// Delete booking
export const deleteBooking = async (id) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`), {
    method: 'DELETE',
    headers: createAuthHeaders(),
  });
  return handleApiResponse(response, 'Failed to delete booking');
};

// Confirm booking (mark as confirmed)
export const confirmBooking = async (bookingId) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}/confirm`), {
    method: 'POST',
    headers: createAuthHeaders(),
  });
  return handleApiResponse(response, 'Failed to confirm booking');
};

// ============================================================================
// USER PROFILE API CALLS
// ============================================================================

// Get user's profile data for pre-filling forms (protected)
export const getUserProfile = async () => {
  checkApiAvailability();
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to get user profile');
  }
  
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/user/profile`), {
    method: 'GET',
    headers: createAuthHeaders(),
  });
  return handleApiResponse(response, 'Failed to fetch user profile');
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  checkApiAvailability();
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required to update profile');
  }
  
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS}/user/profile`), {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleApiResponse(response, 'Failed to update user profile');
};

// ============================================================================
// AUTHENTICATION API CALLS
// ============================================================================

// User login
export const loginUser = async (credentials) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/login`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleApiResponse(response, 'Login failed');
};

// User registration
export const registerUser = async (userData) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/register`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleApiResponse(response, 'Registration failed');
};

// User logout
export const logoutUser = async () => {
  checkApiAvailability();
  const token = getAuthToken();
  
  if (!token) {
    return { success: true, message: 'Already logged out' };
  }
  
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/logout`), {
    method: 'POST',
    headers: createAuthHeaders(),
  });
  return handleApiResponse(response, 'Logout failed');
};

// Forgot password
export const forgotPassword = async (email) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/forgot-password`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse(response, 'Failed to send password reset email');
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/reset-password`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return handleApiResponse(response, 'Failed to reset password');
};

// Verify email
export const verifyEmail = async (token) => {
  checkApiAvailability();
  const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/verify-email`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return handleApiResponse(response, 'Failed to verify email');
};

// ============================================================================
// UTILITY API CALLS
// ============================================================================

// Check API health/status
export const checkApiHealth = async () => {
  checkApiAvailability();
  const response = await fetch(getApiUrl('/health'));
  return handleApiResponse(response, 'API health check failed');
};

// Get application settings/config
export const getAppSettings = async () => {
  checkApiAvailability();
  const response = await fetch(getApiUrl('/settings'));
  return handleApiResponse(response, 'Failed to fetch application settings');
};

// Upload file (for documents, etc.)
export const uploadFile = async (file, type = 'document') => {
  checkApiAvailability();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await fetch(getApiUrl('/upload'), {
    method: 'POST',
    headers: createAuthHeaders({ 'Content-Type': 'multipart/form-data' }),
    body: formData,
  });
  return handleApiResponse(response, 'Failed to upload file');
};

// ============================================================================
// EXPORT ALL API FUNCTIONS
// ============================================================================

export default {
  // Location & Data
  fetchCities,
  fetchAirports,
  fetchHubs,
  
  // Vehicle & Addons
  fetchVehicles,
  fetchAddons,
  
  // Bookings
  createBooking,
  getBookings,
  getUserBookingHistory,
  getBookingById,
  updateBooking,
  deleteBooking,
  confirmBooking,
  
  // User Profile
  getUserProfile,
  updateUserProfile,
  
  // Authentication
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  
  // Utilities
  checkApiHealth,
  getAppSettings,
  uploadFile,
};
