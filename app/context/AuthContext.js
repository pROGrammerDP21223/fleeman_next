'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check if we have a token
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          // Verify token with the backend server
          try {
            const response = await fetch('http://localhost:8081/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            const data = await response.json();

            // Adjust this based on your backend API's response structure
            if (data.success || data.valid || data.isValid) {
              // If the API returns user data with the verification, use it
              const userData = data.user || data.userData || data;
              setUser(userData);
            } else {
              // Token is invalid, clear it
              document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('Token verification error:', error);
            // On error, fall back to localStorage data
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } else {
          // Try to get user from localStorage as fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
          // Add any other fields required by your backend API
        }),
      });

      const data = await response.json();

      // Adjust this based on your backend API's response structure
      if (data.success || data.token) {
        // Store the token in a cookie
        const token = data.token || data.accessToken || data.access_token;
        document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        
        // Store user in state and localStorage
        const userData = data.user || data.userData || data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Adjust this based on your backend API's response structure
      if (data.success || data.token) {
        // Store the token in a cookie
        const token = data.token || data.accessToken || data.access_token;
        document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        
        // Store user in state and localStorage
        const userDataResponse = data.user || data.userData || data;
        setUser(userDataResponse);
        localStorage.setItem('user', JSON.stringify(userDataResponse));
        
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  // Logout function
  const logout = () => {
    // Clear the token cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    
    // Redirect to home page
    router.push('/');
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      // Get the token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        return { success: false, message: 'Authentication required' };
      }

      const response = await fetch('http://localhost:8081/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Adjust this based on your backend API's response structure
      if (data.success || data.user || data.userData) {
        // Update user in state and localStorage
        const updatedUserData = data.user || data.userData || data;
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}