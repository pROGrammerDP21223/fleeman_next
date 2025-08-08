"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

export default function BookingSummaryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if booking data exists in sessionStorage
    const storedBookingData = sessionStorage.getItem('bookingData');
    
    if (!storedBookingData) {
      // No booking data found, redirect to home page
      router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(storedBookingData);
      // Check if the booking data has the required fields
      if (!parsedData || Object.keys(parsedData).length === 0) {
        // Invalid or empty booking data, redirect to home page
        router.push('/');
        return;
      }
      
      setBookingData(parsedData);
      setIsLoading(false);
    } catch (error) {
      // Error parsing booking data, redirect to home page
      console.error('Error parsing booking data:', error);
      router.push('/');
      return;
    }
  }, [router]);

  const handleModifyBooking = () => {
    // Redirect to modify booking page
    router.push('/modify-booking');
  };

  const handleConfirmBooking = async () => {
    try {
      // Get the auth token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      // Helper function to format dates for backend (yyyy-MM-dd'T'HH:mm:ss)
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      // Helper function to ensure we have vehicle ID
      const getVehicleId = (vehicleData) => {
        if (!vehicleData) return null;
        // If it's already a number, return it
        if (typeof vehicleData === 'number') return vehicleData;
        // If it's a string that can be converted to number, return the number
        if (typeof vehicleData === 'string' && !isNaN(parseInt(vehicleData))) {
          return parseInt(vehicleData);
        }
        // If it's an object with vehicleId, return that
        if (typeof vehicleData === 'object' && vehicleData.vehicleId) {
          return parseInt(vehicleData.vehicleId);
        }
        // If it's an object with id, return that
        if (typeof vehicleData === 'object' && vehicleData.id) {
          return parseInt(vehicleData.id);
        }
        // Otherwise, return null
        return null;
      };

      // Helper function to ensure we have hub ID
      const getHubId = (hubData) => {
        if (!hubData) return null;
        // If it's already a number, return it
        if (typeof hubData === 'number') return hubData;
        // If it's a string that can be converted to number, return the number
        if (typeof hubData === 'string' && !isNaN(parseInt(hubData))) {
          return parseInt(hubData);
        }
        // If it's an object with location_Id, return that
        if (typeof hubData === 'object' && hubData.location_Id) {
          return parseInt(hubData.location_Id);
        }
        // If it's an object with id, return that
        if (typeof hubData === 'object' && hubData.id) {
          return parseInt(hubData.id);
        }
        // Otherwise, return null
        return null;
      };

      // Prepare the booking data for the backend
      const bookingDataToSend = {
        pickupDate: formatDateForBackend(bookingData.pickupDate),
        returnDate: formatDateForBackend(bookingData.returnDate),
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        selectedHub: getHubId(bookingData.selectedHub),
        selectedReturnHub: getHubId(bookingData.selectedReturnHub),
        selectedVehicle: getVehicleId(bookingData.selectedVehicle),
        selectedAddons: Array.isArray(bookingData.selectedAddons) 
          ? bookingData.selectedAddons.map(id => parseInt(id)).filter(id => !isNaN(id))
          : [],
        userDetails: bookingData.userDetails,
        submittedAt: new Date().toISOString()
      };

      console.log('Sending booking data:', JSON.stringify(bookingDataToSend, null, 2));
      
      // Use the correct API endpoint
      const apiUrl = 'http://192.168.1.28:8080/api/bookings';
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingDataToSend)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      
      // Show success message
      alert('Booking confirmed successfully! Your booking has been saved to our system.');
      
      // Clear the booking data from sessionStorage
      sessionStorage.removeItem('bookingData');
      
      // Redirect to home page or my-bookings page
      router.push('/my-bookings');
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(`Failed to confirm booking: ${error.message}`);
    }
  };

  const handleCancelBooking = () => {
    // Clear the booking data and redirect to home
    sessionStorage.removeItem('bookingData');
    router.push('/');
  };

  // Show loading state while checking sessionStorage
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0">Loading your booking summary...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return null; // Will redirect to home page
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="h2 fw-bold text-dark mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Booking Summary
              </h1>
              <p className="text-muted mb-0">Review your booking details before confirming</p>
            </div>

            {/* Booking Details Card */}
            <div className="card shadow-lg border-0 rounded-4 mb-4">
              <div className="card-header bg-primary text-white py-3">
                <h3 className="h4 mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  Booking Details
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold text-dark mb-2">Pickup Information</h5>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1"><strong>Date:</strong> {bookingData.pickupDate}</p>
                      <p className="mb-1"><strong>Location:</strong> {
                        bookingData.pickupLocation && typeof bookingData.pickupLocation === 'object' 
                          ? (bookingData.pickupLocation.value || bookingData.pickupLocation.city || 'N/A')
                          : (bookingData.pickupLocation || 'N/A')
                      }</p>
                      <p className="mb-0"><strong>Hub:</strong> {bookingData.selectedHub || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold text-dark mb-2">Return Information</h5>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1"><strong>Date:</strong> {bookingData.returnDate}</p>
                      <p className="mb-1"><strong>Location:</strong> {
                        bookingData.returnLocation && typeof bookingData.returnLocation === 'object'
                          ? (bookingData.returnLocation.value || bookingData.returnLocation.city || 'N/A')
                          : (bookingData.returnLocation || 'N/A')
                      }</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold text-dark mb-2">Vehicle Details</h5>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0"><strong>Selected Vehicle:</strong> {bookingData.selectedVehicle || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold text-dark mb-2">Add-ons</h5>
                    <div className="bg-light p-3 rounded">
                      {bookingData.selectedAddons && bookingData.selectedAddons.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {bookingData.selectedAddons.map((addon, index) => (
                            <li key={index} className="mb-1">• {typeof addon === 'object' ? (addon.name || addon.addOnName || 'Unknown Add-on') : addon}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted mb-0">No add-ons selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Details Section */}
                {bookingData.userDetails && (
                  <div className="row">
                    <div className="col-12">
                      <h5 className="fw-bold text-dark mb-2">User Information</h5>
                      <div className="bg-light p-3 rounded">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1"><strong>Name:</strong> {bookingData.userDetails.firstName} {bookingData.userDetails.lastName}</p>
                            <p className="mb-1"><strong>Email:</strong> {bookingData.userDetails.email}</p>
                            <p className="mb-1"><strong>Phone:</strong> {bookingData.userDetails.phone}</p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1"><strong>Address:</strong> {bookingData.userDetails.address}</p>
                            <p className="mb-1"><strong>City:</strong> {bookingData.userDetails.city}</p>
                            <p className="mb-0"><strong>State:</strong> {bookingData.userDetails.state}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold text-dark mb-4 text-center">What would you like to do?</h4>
                <div className="row g-3">
                  <div className="col-md-4">
                    <button 
                      onClick={handleModifyBooking}
                      className="btn btn-outline-primary btn-lg w-100 py-3 fw-bold"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Modify Booking
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button 
                      onClick={handleConfirmBooking}
                      className="btn btn-success btn-lg w-100 py-3 fw-bold"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Confirm Booking
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button 
                      onClick={handleCancelBooking}
                      className="btn btn-danger btn-lg w-100 py-3 fw-bold"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}