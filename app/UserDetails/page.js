"use client";

import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import UserForm from '../_components/Form'
import { useRouter } from 'next/navigation';

const page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if booking data exists in sessionStorage
    const bookingData = sessionStorage.getItem('bookingData');
    
    if (!bookingData) {
      // No booking data found, redirect to home page
      router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(bookingData);
      // Check if the booking data has the required fields
      if (!parsedData || Object.keys(parsedData).length === 0) {
        // Invalid or empty booking data, redirect to home page
        router.push('/');
        return;
      }
    } catch (error) {
      // Error parsing booking data, redirect to home page
      console.error('Error parsing booking data:', error);
      router.push('/');
      return;
    }

    // If user is authenticated, fetch their profile data from external API
    if (isAuthenticated && user) {
      fetchUserProfileData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, router]);

  const fetchUserProfileData = async () => {
    try {
      // Get the token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        console.log('No auth token found, proceeding without user data');
        setIsLoading(false);
        return;
      }

      // Fetch user profile from external API
      const response = await fetch('http://localhost:8081/members/M00001', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Use the user data from the API response
        const profileData = data.user || data.userData || data;
        setUserData(profileData);
      } else {
        console.log('Failed to fetch user profile, proceeding without user data');
        // If API call fails, use the user data from context as fallback
        setUserData(user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If there's an error, use the user data from context as fallback
      setUserData(user);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking sessionStorage and fetching user data
  if (isLoading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="d-flex justify-content-center align-items-center min-vh-50">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <UserForm 
            onClearBooking={() => {
              // Clear booking data and redirect to home
              sessionStorage.removeItem('bookingData');
              router.push('/');
            }}
            userData={userData}
          />
        </div>
      </div>
    </div>
  )
}

export default page