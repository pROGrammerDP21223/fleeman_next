'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search } from "lucide-react";
import SearchableSelect from '../_components/SearchableSelect';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PickupLocationDialog from '../_components/PickupLocationDialog';
import ReturnLocationDialog from '../_components/ReturnLocationDialog';
import { useFetchData } from '../hooks/useFetchData';
import { useFilteredCities } from '../hooks/useFilteredCities';
import { fetchCities, fetchAirports, fetchHubs, fetchVehicles, fetchAddons } from "../api/api";
import { transformAirportsToOptions, transformCitiesToStateOptions } from '../_components/utils/dataTransform';

export default function ModifyBookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch data for location options
  const { data: citiesAPI } = useFetchData(fetchCities);
  const { data: airportsAPI } = useFetchData(fetchAirports);
  const { data: vehiclesAPI, loading: loadingVehicles } = useFetchData(fetchVehicles);
  const { data: addonsAPI, loading: loadingAddons } = useFetchData(fetchAddons);

  // State for hub selection
  const [hubs, setHubs] = useState([]);
  const [loadingHubs, setLoadingHubs] = useState(false);
  const [hubError, setHubError] = useState('');
  
  // Memoized derived data
  const airportOptions = useMemo(() => 
    transformAirportsToOptions(airportsAPI), 
    [airportsAPI]
  );

  const stateOptions = useMemo(() => 
    transformCitiesToStateOptions(citiesAPI), 
    [citiesAPI]
  );

  // Initialize formData first before using it in hooks
  const [formData, setFormData] = useState({
    // Booking details
    pickupDate: '',
    returnDate: '',
    pickupLocationType: 'airport',
    pickupAirport: '',
    pickupState: '',
    pickupCity: '',
    returnLocationEnabled: false,
    returnLocationType: 'airport',
    returnAirport: '',
    returnState: '',
    returnCity: '',
    selectedHub: '',
    selectedVehicleId: '',
    selectedAddons: [],
    
    // User details
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    cell: '',
    homePhone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    creditCardType: '',
    creditCardNumber: '',
    drivingLicenseNumber: '',
    drivingLicenseAuthority: '',
    drivingLicenseExpiry: '',
    internationalDrivingPermitNumber: '',
    internationalDrivingPermitAuthority: '',
    internationalDrivingPermitExpiry: '',
    passportNumber: '',
    passportIssuingCountry: '',
    passportExpiry: '',
    
    // Additional fields that might be in userDetails
    CreditCardType: '',
    CreditCardNo: '',
    drivingLicense: '',
    dlIssuedBy: '',
    dlValidThru: '',
    idpNo: '',
    idpIssuedBy: '',
    idpValidThru: '',
    passportNo: '',
    passportIssuedBy: '',
    passportValid: ''
  });
  
  // Now we can use formData in the hooks
  const filteredPickupCities = useFilteredCities(citiesAPI, formData.pickupState);
  const filteredReturnCities = useFilteredCities(citiesAPI, formData.returnState);
  
  // Fetch hubs when pickup location changes
  useEffect(() => {
    if (formData.pickupLocationType && 
        ((formData.pickupLocationType === 'airport' && formData.pickupAirport) || 
         (formData.pickupLocationType === 'city' && formData.pickupCity))) {
      setLoadingHubs(true);
      setHubError('');
      
      const type = formData.pickupLocationType === 'airport' ? 'airport' : 'city';
      const value = type === 'airport' ? formData.pickupAirport : formData.pickupCity;
      
      fetchHubs(type, value)
        .then((data) => {
          setHubs(data);
          setLoadingHubs(false);
        })
        .catch((error) => {
          console.error('Error fetching hubs:', error);
          setHubError('Unable to fetch hubs. Please try again.');
          setLoadingHubs(false);
        });
    }
  }, [formData.pickupLocationType, formData.pickupAirport, formData.pickupCity, formData.pickupState]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load existing booking data
    const existingBookingData = sessionStorage.getItem('bookingData');
    
    if (existingBookingData) {
      try {
        const parsed = JSON.parse(existingBookingData);
        setBookingData(parsed);
        
        // Populate form with existing data
        const newFormData = { ...formData };
        
        // Booking details
        if (parsed.pickupDate) newFormData.pickupDate = String(parsed.pickupDate);
        if (parsed.returnDate) newFormData.returnDate = String(parsed.returnDate);
        
        // Pickup location
        if (parsed.pickupLocation) {
          newFormData.pickupLocationType = String(parsed.pickupLocation.type || '');
          if (parsed.pickupLocation.type === 'airport') {
            newFormData.pickupAirport = String(parsed.pickupLocation.value || '');
          } else {
            newFormData.pickupState = String(parsed.pickupLocation.state || '');
            newFormData.pickupCity = String(parsed.pickupLocation.city || '');
          }
        }
        
        // Return location
        if (parsed.returnLocation && parsed.returnLocation !== parsed.pickupLocation) {
          newFormData.returnLocationEnabled = true;
          newFormData.returnLocationType = String(parsed.returnLocation.type || '');
          if (parsed.returnLocation.type === 'airport') {
            newFormData.returnAirport = String(parsed.returnLocation.value || '');
          } else {
            newFormData.returnState = String(parsed.returnLocation.state || '');
            newFormData.returnCity = String(parsed.returnLocation.city || '');
          }
        }
        
        // Other selections
        if (parsed.selectedHub) newFormData.selectedHub = String(parsed.selectedHub);
        if (parsed.selectedReturnHub) newFormData.selectedReturnHub = String(parsed.selectedReturnHub);
        if (parsed.selectedVehicle) newFormData.selectedVehicleId = String(parsed.selectedVehicle);
        if (parsed.selectedAddons) newFormData.selectedAddons = Array.isArray(parsed.selectedAddons) ? parsed.selectedAddons.map(String) : [];
        
        // User details
        if (parsed.userDetails) {
          Object.keys(parsed.userDetails).forEach(key => {
            if (parsed.userDetails[key] !== undefined && parsed.userDetails[key] !== null) {
              // Ensure all values are converted to strings to prevent controlled/uncontrolled input errors
              newFormData[key] = String(parsed.userDetails[key]);
            }
          });
        }
        
        setFormData(newFormData);
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.cell) newErrors.cell = 'Phone number is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

    // Prepare updated booking data
    const updatedBookingData = {
      pickupDate: formatDateForBackend(formData.pickupDate),
      returnDate: formatDateForBackend(formData.returnDate),
      pickupLocation: {
        type: formData.pickupLocationType,
        value: formData.pickupLocationType === 'airport' ? formData.pickupAirport : null,
        state: formData.pickupLocationType === 'city' ? formData.pickupState : null,
        city: formData.pickupLocationType === 'city' ? formData.pickupCity : null
      },
      returnLocation: formData.returnLocationEnabled ? {
        type: formData.returnLocationType,
        value: formData.returnLocationType === 'airport' ? formData.returnAirport : null,
        state: formData.returnLocationType === 'city' ? formData.returnState : null,
        city: formData.returnLocationType === 'city' ? formData.returnCity : null
      } : null,
      selectedHub: formData.selectedHub ? parseInt(formData.selectedHub) : null,
      selectedReturnHub: formData.selectedReturnHub ? parseInt(formData.selectedReturnHub) : null,
      selectedVehicle: formData.selectedVehicleId ? parseInt(formData.selectedVehicleId) : null,
       selectedAddons: formData.selectedAddons.map(id => parseInt(id)).filter(id => !isNaN(id)),
      userDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        email: formData.email,
        city: formData.city,
        zip: formData.zip,
        homePhone: formData.homePhone,
        cell: formData.cell,
        drivingLicense: formData.drivingLicense,
        dlIssuedBy: formData.dlIssuedBy,
        dlValidThru: formData.dlValidThru,
        idpNo: formData.idpNo,
        idpIssuedBy: formData.idpIssuedBy,
        idpValidThru: formData.idpValidThru,
        passportNo: formData.passportNo,
        passportIssuedBy: formData.passportIssuedBy,
        passportValid: formData.passportValid,
        birthDate: formData.birthDate,
        CreditCardType: formData.CreditCardType,
        CreditCardNo: formData.CreditCardNo
      },
      // Preserve confirmation status if it exists
      confirmed: bookingData?.confirmed || false,
      confirmedAt: bookingData?.confirmedAt || null,
      submittedAt: new Date().toISOString()
    };

    // Save updated booking data to sessionStorage first
    // Clear existing booking data and save the updated data
    sessionStorage.removeItem('bookingData');
    sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('bookingDataChanged'));
    
    // Try to send to API (optional - for immediate backend update)
    try {
      
      const res = await fetch('http://localhost:8081/api/booking-details/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBookingData)
      });

      if (res.ok) {
        const data = await res.json();
        
        // If booking is confirmed, we can optionally remove from sessionStorage
        if (data?.confirmed) {
          sessionStorage.removeItem('bookingData');
          window.dispatchEvent(new Event('bookingDataChanged'));
        }
      }
    } catch (error) {
      // Don't show error to user since data is saved locally
    }
    
    alert('Booking updated successfully!');
    router.push('/booking-summary');
  };

  const handleCancel = () => {
    router.push('/my-bookings');
  };

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
                  <p className="text-muted mb-0">Loading your booking details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
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
                  <h2 className="h3 fw-bold text-dark mb-3">No Booking Found</h2>
                  <p className="text-muted mb-4">No booking data found to modify.</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                  >
                    <i className="bi bi-car-front me-2"></i>
                    Book a Car
                  </button>
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
                <i className="bi bi-pencil-square text-primary me-2"></i>
                Modify Booking
              </h1>
              <p className="text-muted mb-0">Update your car rental booking details</p>
            </div>

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  {/* Booking Details Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-primary text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-calendar-event me-2"></i>
                        Booking Details
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="pickupDate" className="form-label fw-semibold">
                            Pickup Date and Time <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-calendar"></i>
                            </span>
                            <input
                              id="pickupDate"
                              name="pickupDate"
                              type="datetime-local"
                              value={formData.pickupDate}
                              onChange={handleChange}
                              className={`form-control ${errors.pickupDate ? 'is-invalid' : ''}`}
                              required
                            />
                            {errors.pickupDate && <div className="invalid-feedback">{errors.pickupDate}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="returnDate" className="form-label fw-semibold">
                            Return Date and Time <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-calendar-check"></i>
                            </span>
                            <input
                              id="returnDate"
                              name="returnDate"
                              type="datetime-local"
                              value={formData.returnDate}
                              min={formData.pickupDate}
                              onChange={handleChange}
                              className={`form-control ${errors.returnDate ? 'is-invalid' : ''}`}
                              required
                            />
                            {errors.returnDate && <div className="invalid-feedback">{errors.returnDate}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Pickup Location</label>
                          <PickupLocationDialog
                            pickupLocationType={formData.pickupLocationType}
                            pickupAirport={formData.pickupAirport}
                            pickupState={formData.pickupState}
                            pickupCity={formData.pickupCity}
                            airportOptions={airportOptions}
                            stateOptions={stateOptions}
                            filteredPickupCities={filteredPickupCities}
                            onPickupLocationTypeChange={(value) => setFormData(prev => ({ ...prev, pickupLocationType: value }))}
                            onPickupAirportChange={(value) => setFormData(prev => ({ ...prev, pickupAirport: value }))}
                            onPickupStateChange={(value) => setFormData(prev => ({ ...prev, pickupState: value }))}
                            onPickupCityChange={(value) => setFormData(prev => ({ ...prev, pickupCity: value }))}
                            hasError={false}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Return Location</label>
                          <div className="form-check mb-2">
                            <input
                              type="checkbox"
                              id="returnLocationEnabled"
                              checked={formData.returnLocationEnabled}
                              onChange={(e) => setFormData(prev => ({ ...prev, returnLocationEnabled: e.target.checked }))}
                              className="form-check-input"
                            />
                            <label htmlFor="returnLocationEnabled" className="form-check-label">
                              Different return location
                            </label>
                          </div>
                          {formData.returnLocationEnabled && (
                            <ReturnLocationDialog
                              returnLocationType={formData.returnLocationType}
                              returnAirport={formData.returnAirport}
                              returnState={formData.returnState}
                              returnCity={formData.returnCity}
                              airportOptions={airportOptions}
                              stateOptions={stateOptions}
                              filteredReturnCities={filteredReturnCities}
                              onReturnLocationTypeChange={(value) => setFormData(prev => ({ ...prev, returnLocationType: value }))}
                              onReturnAirportChange={(value) => setFormData(prev => ({ ...prev, returnAirport: value }))}
                              onReturnStateChange={(value) => setFormData(prev => ({ ...prev, returnState: value }))}
                              onReturnCityChange={(value) => setFormData(prev => ({ ...prev, returnCity: value }))}
                              hasError={false}
                            />
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Pickup Hub</label>
                          {loadingHubs ? (
                            <div className="d-flex align-items-center justify-content-center p-3">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              <span className="text-muted">Loading hubs...</span>
                            </div>
                          ) : hubError ? (
                            <div className="alert alert-danger py-2">{hubError}</div>
                          ) : hubs.length > 0 ? (
                            <div className="row g-2">
                              {hubs.map((hub) => {
                                // Handle the nested hub structure from the API
                                const hubId = hub.location_Id;
                                const hubName = hub.location_Name;
                                const hubAddress = hub.address;
                                const hubCity = hub.city && hub.city.city_Name;
                                const hubState = hub.state && hub.state.state_Name;
                                const hubZipCode = hub.zipCode || hub.zip_Code;
                                const hubPhone = hub.phone || hub.phone_Number;

                                return (
                                  <div key={hubId || `hub-${Math.random()}`} className="col-md-6">
                                    <div className={`card ${formData.selectedHub === String(hubId) ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}>
                                      <div className="card-body p-3">
                                        <div className="form-check">
                                          <input
                                            type="radio"
                                            name="hub"
                                            value={hubId}
                                            checked={formData.selectedHub === String(hubId)}
                                            onChange={() => setFormData(prev => ({ ...prev, selectedHub: String(hubId) }))}
                                            className="form-check-input"
                                          />
                                          <label className="form-check-label">
                                            <strong>{hubName}</strong>
                                            {hubAddress && <div className="small text-muted">{hubAddress}</div>}
                                            {hubCity && hubState && <div className="small text-muted">{hubCity}, {hubState}</div>}
                                            {hubZipCode && <div className="small text-muted">{hubZipCode}</div>}
                                            {hubPhone && <div className="small text-primary">{hubPhone}</div>}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center text-muted py-3">
                              <i className="bi bi-info-circle me-2"></i>
                              No hubs available for the selected location.
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Select Vehicle</label>
                          {loadingVehicles ? (
                            <div className="d-flex align-items-center justify-content-center p-3">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              <span className="text-muted">Loading vehicles...</span>
                            </div>
                          ) : vehiclesAPI && vehiclesAPI.length > 0 ? (
                            <div className="row g-2">
                              {vehiclesAPI.map((vehicle) => {
                                const isSelected = formData.selectedVehicleId === vehicle.vehicleId;
                                return (
                                  <div key={vehicle.vehicleId} className="col-md-6">
                                    <div className={`card ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}>
                                      <div className="card-body p-3">
                                        <div className="form-check">
                                          <input
                                            type="radio"
                                            name="vehicle"
                                            value={vehicle.vehicleId}
                                            checked={isSelected}
                                            onChange={() => setFormData(prev => ({ ...prev, selectedVehicleId: vehicle.vehicleId }))}
                                            className="form-check-input"
                                          />
                                          <label className="form-check-label">
                                            <strong>{vehicle.vehicleType}</strong>
                                            <div className="small text-muted">
                                              Daily: ${vehicle.dailyRate} | Weekly: ${vehicle.weeklyRate}
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center text-muted py-3">
                              <i className="bi bi-info-circle me-2"></i>
                              No vehicles available.
                            </div>
                          )}
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">Select Add-ons</label>
                          {loadingAddons ? (
                            <div className="d-flex align-items-center justify-content-center p-3">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              <span className="text-muted">Loading add-ons...</span>
                            </div>
                          ) : addonsAPI && addonsAPI.length > 0 ? (
                            <div className="row g-2">
                              {addonsAPI.map((addon) => {
                                const isSelected = formData.selectedAddons.includes(String(addon.addOnId));
                                return (
                                  <div key={addon.addOnId} className="col-md-4">
                                    <div className={`card ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}>
                                      <div className="card-body p-3">
                                        <div className="form-check">
                                          <input
                                            type="checkbox"
                                            name={`addon-${addon.addOnId}`}
                                            checked={isSelected}
                                            onChange={() => {
                                              const updatedAddons = isSelected
                                                ? formData.selectedAddons.filter(id => id !== String(addon.addOnId))
                                                : [...formData.selectedAddons, String(addon.addOnId)];
                                              setFormData(prev => ({ ...prev, selectedAddons: updatedAddons }));
                                            }}
                                            className="form-check-input"
                                          />
                                          <label className="form-check-label">
                                            <strong>{addon.addOnName}</strong>
                                            {addon.description && <div className="small text-muted">{addon.description}</div>}
                                            {addon.addOnPrice && <div className="small text-success fw-bold">${addon.addOnPrice}</div>}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center text-muted py-3">
                              <i className="bi bi-info-circle me-2"></i>
                              No add-ons available.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
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
                          <label htmlFor="firstName" className="form-label fw-semibold">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="Enter your first name"
                            required
                          />
                          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label fw-semibold">
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Enter your last name"
                            required
                          />
                          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="birthDate" className="form-label fw-semibold">
                            Date of Birth
                          </label>
                          <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label fw-semibold">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email"
                            required
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-info text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-telephone me-2"></i>
                        Contact Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="cell" className="form-label fw-semibold">
                            Mobile Phone <span className="text-danger">*</span>
                          </label>
                          <input
                            id="cell"
                            name="cell"
                            type="tel"
                            value={formData.cell}
                            onChange={handleChange}
                            className={`form-control ${errors.cell ? 'is-invalid' : ''}`}
                            placeholder="Enter your mobile number"
                            required
                          />
                          {errors.cell && <div className="invalid-feedback">{errors.cell}</div>}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="homePhone" className="form-label fw-semibold">
                            Home Phone
                          </label>
                          <input
                            id="homePhone"
                            name="homePhone"
                            type="tel"
                            value={formData.homePhone}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your home phone"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-warning text-dark rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-geo-alt me-2"></i>
                        Address Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label htmlFor="address1" className="form-label fw-semibold">
                            Street Address
                          </label>
                          <input
                            id="address1"
                            name="address1"
                            value={formData.address1}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your street address"
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="address2" className="form-label fw-semibold">
                            Apt/Suite/Other
                          </label>
                          <input
                            id="address2"
                            name="address2"
                            value={formData.address2}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Apartment, suite, etc. (optional)"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="city" className="form-label fw-semibold">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your city"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="zip" className="form-label fw-semibold">
                            ZIP/Postal Code
                          </label>
                          <input
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter ZIP code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-secondary text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-credit-card me-2"></i>
                        Payment Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="CreditCardType" className="form-label fw-semibold">
                            Credit Card Type
                          </label>
                          <select
                            id="CreditCardType"
                            name="CreditCardType"
                            value={formData.CreditCardType}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select card type</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                            <option value="discover">Discover</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="CreditCardNo" className="form-label fw-semibold">
                            Credit Card Number
                          </label>
                          <input
                            id="CreditCardNo"
                            name="CreditCardNo"
                            value={formData.CreditCardNo}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter card number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driving License Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-dark text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-card-text me-2"></i>
                        Driving License
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="drivingLicense" className="form-label fw-semibold">
                            License Number
                          </label>
                          <input
                            id="drivingLicense"
                            name="drivingLicense"
                            value={formData.drivingLicense}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter license number"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="dlIssuedBy" className="form-label fw-semibold">
                            Issued By
                          </label>
                          <input
                            id="dlIssuedBy"
                            name="dlIssuedBy"
                            value={formData.dlIssuedBy}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Issuing authority"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="dlValidThru" className="form-label fw-semibold">
                            Expiration Date
                          </label>
                          <input
                            id="dlValidThru"
                            name="dlValidThru"
                            type="date"
                            value={formData.dlValidThru}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* International Driving Permit Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                      <h5 className="mb-0">
                        <i className="bi bi-globe me-2"></i>
                        International Driving Permit
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="idpNo" className="form-label fw-semibold">
                            IDP Number
                          </label>
                          <input
                            id="idpNo"
                            name="idpNo"
                            value={formData.idpNo}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter IDP number"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="idpIssuedBy" className="form-label fw-semibold">
                            Issued By
                          </label>
                          <input
                            id="idpIssuedBy"
                            name="idpIssuedBy"
                            value={formData.idpIssuedBy}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Issuing authority"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="idpValidThru" className="form-label fw-semibold">
                            Expiration Date
                          </label>
                          <input
                            id="idpValidThru"
                            name="idpValidThru"
                            type="date"
                            value={formData.idpValidThru}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Passport Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header" style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                      <h5 className="mb-0">
                        <i className="bi bi-passport me-2"></i>
                        Passport Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="passportNo" className="form-label fw-semibold">
                            Passport Number
                          </label>
                          <input
                            id="passportNo"
                            name="passportNo"
                            value={formData.passportNo}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter passport number"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="passportIssuedBy" className="form-label fw-semibold">
                            Issuing Country
                          </label>
                          <input
                            id="passportIssuedBy"
                            name="passportIssuedBy"
                            value={formData.passportIssuedBy}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Issuing country"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="passportValid" className="form-label fw-semibold">
                            Expiration Date
                          </label>
                          <input
                            id="passportValid"
                            name="passportValid"
                            type="date"
                            value={formData.passportValid}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="d-grid gap-3 d-md-flex justify-content-md-center pt-4">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg px-5 py-3 fw-bold"
                      style={{ minWidth: '180px' }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Update Booking
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-outline-secondary btn-lg px-5 py-3 fw-bold"
                      style={{ minWidth: '180px' }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}