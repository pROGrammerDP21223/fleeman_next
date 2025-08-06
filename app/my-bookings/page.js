'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!isAuthenticated) {
          setError('Please log in to view your booking history');
          setLoading(false);
          return;
        }

        // Get the token from cookie
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (!token) {
          setError('Authentication required to view booking history');
          setLoading(false);
          return;
        }

        // Fetch booking history from external API
        const response = await fetch('http://localhost:8081/api/bookings/user/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication required to view booking history');
          } else {
            setError('Failed to load booking history. Please try again.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // Handle different possible response structures
        let bookingsData = [];
        if (Array.isArray(data)) {
          bookingsData = data;
        } else if (data.bookings && Array.isArray(data.bookings)) {
          bookingsData = data.bookings;
        } else if (data.data && Array.isArray(data.data)) {
          bookingsData = data.data;
        } else if (data.userBookings && Array.isArray(data.userBookings)) {
          bookingsData = data.userBookings;
        } else {
          console.log('Unexpected API response structure:', data);
          bookingsData = [];
        }

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setError('Failed to load booking history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (!token) {
          alert('Authentication required to cancel booking');
          return;
        }

        const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Remove the booking from the local state
          setBookings(prev => prev.filter(booking => booking.id !== bookingId));
          alert('Booking cancelled successfully!');
        } else {
          alert('Failed to cancel booking. Please try again.');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('An error occurred while cancelling the booking.');
      }
    }
  };

  const handleModifyBooking = (bookingId) => {
    // Store the booking ID in sessionStorage for the modify page
    sessionStorage.setItem('modifyBookingId', bookingId);
    router.push('/modify-booking');
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        alert('Authentication required to confirm booking');
        return;
      }

      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update the booking status in local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, confirmed: true, confirmedAt: new Date().toISOString() }
            : booking
        ));
        alert('Booking confirmed successfully!');
      } else {
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('An error occurred while confirming the booking.');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-lock text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Authentication Required</h2>
                  <p className="text-muted mb-4">Please log in to view your booking history.</p>
                  <Link href="/auth/login" className="btn btn-primary btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">Error Loading Bookings</h2>
                  <p className="text-muted mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-primary btn-lg"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-3">No Bookings Found</h2>
                  <p className="text-muted mb-4">You don't have any active bookings at the moment.</p>
                  <Link 
                    href="/"
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-car-front me-2"></i>
                    Book a Car
                  </Link>
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
              <p className="text-muted mb-0">Manage your car rental bookings</p>
              {user && (
                <p className="text-muted mt-2">
                  Welcome back, {user.firstName || user.first_name || user.email}!
                </p>
              )}
            </div>

            {bookings.map((booking, index) => (
              <div key={booking.id || index} className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-body p-5">
                  {/* Booking Status */}
                  <div className={`alert ${booking.confirmed ? 'alert-success' : 'alert-warning'} mb-4`} role="alert">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className={`fw-bold mb-1 ${booking.confirmed ? 'text-success' : 'text-warning'}`}>
                          <i className={`bi ${booking.confirmed ? 'bi-check-circle' : 'bi-clock'} me-2`}></i>
                          {booking.confirmed ? 'Booking Confirmed' : 'Pending Confirmation'}
                        </h4>
                        <p className={`mb-0 ${booking.confirmed ? 'text-success' : 'text-warning'}`}>
                          {booking.confirmed 
                            ? `Confirmed on ${new Date(booking.confirmedAt || booking.confirmed_at).toLocaleDateString()}`
                            : 'Please confirm your booking to proceed with the rental'
                          }
                        </p>
                      </div>
                      {booking.confirmed && (
                        <span className="badge bg-success fs-6 px-3 py-2">
                          <i className="bi bi-check-circle me-1"></i>
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-primary text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Booking Details
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar-event text-primary me-2"></i>
                            <div>
                              <small className="text-muted fw-semibold">Pickup Date</small>
                              <p className="mb-0 fw-medium">{booking.pickupDate || booking.pickup_date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar-check text-success me-2"></i>
                            <div>
                              <small className="text-muted fw-semibold">Return Date</small>
                              <p className="mb-0 fw-medium">{booking.returnDate || booking.return_date}</p>
                            </div>
                          </div>
                        </div>
                        {booking.selectedVehicle && (
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-car-front text-info me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Selected Vehicle</small>
                                <p className="mb-0 fw-medium">{booking.selectedVehicle}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {booking.selectedHub && (
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-geo-alt text-warning me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Pickup Location</small>
                                <p className="mb-0 fw-medium">{booking.selectedHub}</p>
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
                        {booking.selectedAddons && booking.selectedAddons.length > 0 && (
                          <div className="col-12">
                            <div className="d-flex align-items-start">
                              <i className="bi bi-plus-circle text-secondary me-2 mt-1"></i>
                              <div>
                                <small className="text-muted fw-semibold">Selected Add-ons</small>
                                <p className="mb-0 fw-medium">
                                  {booking.selectedAddons.map(addon => 
                                    typeof addon === 'object' ? (addon.name || addon.addOnName || 'Unknown') : addon
                                  ).join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  {booking.userDetails && (
                    <div className="card mb-4 border-0 bg-light">
                      <div className="card-header bg-success text-white rounded-top">
                        <h5 className="mb-0">
                          <i className="bi bi-person me-2"></i>
                          Personal Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-badge text-success me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Name</small>
                                <p className="mb-0 fw-medium">
                                  {booking.userDetails.firstName || booking.userDetails.first_name} {booking.userDetails.lastName || booking.userDetails.last_name}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-envelope text-info me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Email</small>
                                <p className="mb-0 fw-medium">{booking.userDetails.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-telephone text-warning me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Phone</small>
                                <p className="mb-0 fw-medium">{booking.userDetails.cell || booking.userDetails.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-house text-primary me-2"></i>
                              <div>
                                <small className="text-muted fw-semibold">Address</small>
                                <p className="mb-0 fw-medium">
                                  {booking.userDetails.address1 || booking.userDetails.address}, {booking.userDetails.city}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-grid gap-3 d-md-flex justify-content-md-center pt-4">
                    {!booking.confirmed && (
                      <>
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="btn btn-success btn-lg px-5 py-3 fw-bold"
                          style={{ minWidth: '180px' }}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => handleModifyBooking(booking.id)}
                          className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                          style={{ minWidth: '180px' }}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Modify Booking
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-danger btn-lg px-5 py-3 fw-bold"
                          style={{ minWidth: '180px' }}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel Booking
                        </button>
                      </>
                    )}
                    {booking.confirmed && (
                      <Link 
                        href="/"
                        className="btn btn-warning btn-lg px-5 py-3 fw-bold"
                        style={{ minWidth: '200px' }}
                      >
                        <i className="bi bi-car-front me-2"></i>
                        Book Another Car
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 