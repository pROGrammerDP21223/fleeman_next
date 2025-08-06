'use client';

import { useState, useEffect } from 'react';
import UserForm from './Form';
import HomeForm from './HomeForm';
import BookingSummary from './BookingSummary';

export default function ConditionalForm() {
  const [hasBookingData, setHasBookingData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const checkBookingData = () => {
    try {
      const bookingData = sessionStorage.getItem('bookingData');
      if (bookingData) {
        const parsedData = JSON.parse(bookingData);
        // Check if the booking data has the required fields
        if (parsedData && Object.keys(parsedData).length > 0) {
          // Check if this is a completed booking (has user details)
          if (parsedData.userDetails) {
            setHasBookingData(false); // Show HomeForm for completed bookings
            setHasCompletedBooking(true); // Show BookingSummary
            setIsEditing(false);
          } else {
            setHasBookingData(true); // Show UserForm for incomplete bookings
            setHasCompletedBooking(false);
            // Check if we're editing (have booking data but no user details)
            if (parsedData.pickupDate || parsedData.selectedHub || parsedData.selectedVehicle) {
              setIsEditing(true);
            } else {
              setIsEditing(false);
            }
          }
        } else {
          setHasBookingData(false);
          setHasCompletedBooking(false);
          setIsEditing(false);
        }
      } else {
        setHasBookingData(false);
        setHasCompletedBooking(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error reading booking data from sessionStorage:', error);
      setHasBookingData(false);
      setHasCompletedBooking(false);
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check sessionStorage for booking data on mount
    checkBookingData();

    // Listen for storage events (when sessionStorage changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'bookingData') {
        checkBookingData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events for same-tab changes
    const handleCustomStorageChange = () => {
      checkBookingData();
    };

    window.addEventListener('bookingDataChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookingDataChanged', handleCustomStorageChange);
    };
  }, []);

  // Function to clear booking data and switch back to HomeForm
  // This ensures only one booking entry exists in sessionStorage
  const clearBookingData = () => {
    sessionStorage.removeItem('bookingData');
    setHasBookingData(false);
    setHasCompletedBooking(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('bookingDataChanged'));
  };

  // Function to start a new booking (clear old data and show HomeForm)
  // This ensures only one booking entry exists in sessionStorage
  const startNewBooking = () => {
    sessionStorage.removeItem('bookingData');
    setHasBookingData(false);
    setHasCompletedBooking(false);
    setIsEditing(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('bookingDataChanged'));
  };



  // Show loading state while checking sessionStorage
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA633]"></div>
      </div>
    );
  }

  // Conditional rendering based on booking state
  return (
    <>
      <h1 className='text-2xl font-bold text-center mt-4'>
        {isEditing ? 'Modify Your Booking...' : hasCompletedBooking ? 'Booking Summary' : ' '}
      </h1>
      <div className="flex justify-center items-center min-h-[400px] w-100"> 
        {hasBookingData ? (
          <UserForm onClearBooking={clearBookingData} />
        ) : hasCompletedBooking ? (
          <BookingSummary onStartNewBooking={startNewBooking} />
        ) : (
          <HomeForm />
        )}
      </div>
    </>
  );
}