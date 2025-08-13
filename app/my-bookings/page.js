'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import { getVehicleNameById, getAddonNamesByIds, getHubNameById } from '../_components/utils/dataTransform';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [addons, setAddons] = useState([]);
  const [hubs, setHubs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Get vehicle and addon data from sessionStorage or API
        // For now, we'll use empty arrays - in a real app, you'd fetch these
        const vehiclesData = JSON.parse(sessionStorage.getItem('vehicles') || '[]');
        const addonsData = JSON.parse(sessionStorage.getItem('addons') || '[]');
        const hubsData = JSON.parse(sessionStorage.getItem('hubs') || '[]');
        
        setVehicles(vehiclesData);
        setAddons(addonsData);
        setHubs(hubsData);

        // Get the auth token
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        let response;
        if (token) {
          response = await fetch('http://localhost:8084/api/bookings/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } else {
          response = await fetch('http://localhost:8084/api/bookings');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, router]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      let response;
      if (token) {
        response = await fetch(`http://localhost:8084/api/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        response = await fetch(`http://localhost:8084/api/bookings/${bookingId}`, {
          method: 'DELETE'
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the booking from the local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(`Failed to cancel booking: ${error.message}`);
    }
  };

  const handleModifyBooking = (bookingId) => {
    // Store the booking data in sessionStorage for editing
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      sessionStorage.setItem('bookingData', JSON.stringify(booking));
      router.push('/modify-booking');
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      let response;
      if (token) {
        response = await fetch(`http://localhost:8084/api/bookings/${bookingId}/confirm`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await fetch(`http://localhost:8084/api/bookings/${bookingId}/confirm`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the booking status in the local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, confirmed: true, confirmedAt: new Date().toISOString() }
          : booking
      ));
      alert('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(`Failed to confirm booking: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-shield-lock text-warning" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Authentication Required</h2>
                  <p className="text-muted mb-4">Please log in to view your bookings.</p>
                  <button 
                    onClick={() => router.push('/auth/login')}
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
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
                  <p className="text-muted mb-0">Loading your bookings...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="h2 fw-bold text-dark mb-2">
                <i className="bi bi-calendar-check text-primary me-2"></i>
                My Bookings
              </h1>
              <p className="text-muted mb-0">Welcome back, {user?.firstName || user?.email}</p>
            </div>

            {bookings.length === 0 ? (
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">No Bookings Found</h2>
                  <p className="text-muted mb-4">You don't have any bookings yet.</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-car-front me-2"></i>
                    Book a Car
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {bookings.map((booking, index) => {
                  // Get display names using utility functions
                  const vehicleName = getVehicleNameById(booking.selectedVehicle, vehicles);
                  const addonNames = getAddonNamesByIds(booking.selectedAddons, addons);
                  const hubName = getHubNameById(booking.selectedHub, hubs);

                  return (
                    <div key={booking.id || index} className="col-12">
                      <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-primary text-white rounded-top">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                              <i className="bi bi-calendar-event me-2"></i>
                              Booking #{booking.id || (index + 1)}
                            </h5>
                            <span className={`badge ${booking.confirmed ? 'bg-success' : 'bg-warning'}`}>
                              {booking.confirmed ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* Booking Details */}
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-plus text-primary me-2"></i>
                                <div>
                                  <small className="text-muted fw-semibold">Pickup Date</small>
                                  <p className="mb-0 fw-medium">{booking.pickupDate}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-minus text-danger me-2"></i>
                                <div>
                                  <small className="text-muted fw-semibold">Return Date</small>
                                  <p className="mb-0 fw-medium">{booking.returnDate}</p>
                                </div>
                              </div>
                            </div>
                            {vehicleName && (
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-car-front text-info me-2"></i>
                                  <div>
                                    <small className="text-muted fw-semibold">Selected Vehicle</small>
                                    <p className="mb-0 fw-medium">{vehicleName}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {hubName && (
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-geo-alt text-warning me-2"></i>
                                  <div>
                                    <small className="text-muted fw-semibold">Pickup Location</small>
                                    <p className="mb-0 fw-medium">{hubName}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {booking.returnLocation && (
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                  <div>
                                    <small className="text-muted fw-semibold">Return Location</small>
                                    <p className="mb-0 fw-medium">
                                      {typeof booking.returnLocation === 'object' 
                                        ? (booking.returnLocation.value || booking.returnLocation.city || 'N/A')
                                        : booking.returnLocation
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {addonNames && addonNames.length > 0 && (
                              <div className="col-12">
                                <div className="d-flex align-items-start">
                                  <i className="bi bi-plus-circle text-secondary me-2 mt-1"></i>
                                  <div>
                                    <small className="text-muted fw-semibold">Selected Add-ons</small>
                                    <p className="mb-0 fw-medium">
                                      {addonNames.join(', ')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 