'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../api/api';

export default function UserProfileFiller({ onProfileLoaded }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isAuthenticated) {
        return; // Don't load profile if user is not authenticated
      }

      setLoading(true);
      setError('');

      try {
        const userProfile = await getUserProfile();
        
        // Call the callback with user profile data
        if (onProfileLoaded) {
          onProfileLoaded(userProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load user profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, onProfileLoaded]);

  // This component doesn't render anything visible
  // It just handles the profile loading logic
  return null;
} 