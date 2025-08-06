'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserForm({ onClearBooking, userData = null }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address1: '', address2: '', email: '',
    city: '', zip: '', homePhone: '', cell: '', drivingLicense: '',
    dlIssuedBy: '', dlValidThru: '', idpNo: '', idpIssuedBy: '', idpValidThru: '',
    passportNo: '', passportIssuedBy: '', passportValid: '', birthDate: '',
    CreditCardType: '', CreditCardNo: ''
  });
  const router = useRouter();

  // Pre-fill form with user data when component mounts or userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || userData.first_name || '',
        lastName: userData.lastName || userData.last_name || '',
        email: userData.email || '',
        cell: userData.phone || userData.cell || userData.mobile || '',
        homePhone: userData.homePhone || userData.home_phone || '',
        address1: userData.address || userData.address1 || userData.street_address || '',
        address2: userData.address2 || userData.apt_suite || '',
        city: userData.city || '',
        zip: userData.zipCode || userData.zip || userData.postal_code || '',
        birthDate: userData.birthDate || userData.date_of_birth || '',
        // Driving license info
        drivingLicense: userData.drivingLicense || userData.license_number || '',
        dlIssuedBy: userData.dlIssuedBy || userData.license_issued_by || '',
        dlValidThru: userData.dlValidThru || userData.license_expiry || '',
        // International driving permit
        idpNo: userData.idpNo || userData.idp_number || '',
        idpIssuedBy: userData.idpIssuedBy || userData.idp_issued_by || '',
        idpValidThru: userData.idpValidThru || userData.idp_expiry || '',
        // Passport info
        passportNo: userData.passportNo || userData.passport_number || '',
        passportIssuedBy: userData.passportIssuedBy || userData.passport_issued_by || '',
        passportValid: userData.passportValid || userData.passport_expiry || '',
        // Payment info
        CreditCardType: userData.CreditCardType || userData.credit_card_type || '',
        CreditCardNo: userData.CreditCardNo || userData.credit_card_number || ''
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    
    // Get existing booking data from localStorage
    const existingBookingData = localStorage.getItem('bookingData');
    let completeBookingData = {};
    
    if (existingBookingData) {
      try {
        completeBookingData = JSON.parse(existingBookingData);
      } catch (error) {
        console.error('Error parsing existing booking data:', error);
      }
    }
    
    // Merge user form data with existing booking data
    const finalBookingData = {
      ...completeBookingData,
      userDetails: formData,
      submittedAt: new Date().toISOString()
    };
    
    // Save the complete booking data back to localStorage (preserve existing data)
    localStorage.setItem('bookingData', JSON.stringify(finalBookingData));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('bookingDataChanged'));
    
    // Show success message
    alert('Application submitted successfully! Your booking and personal details have been saved.');
    
    // Redirect to booking summary page
    router.push("/booking-summary");
  };

  const handleClear = () => {
    setFormData(Object.fromEntries(Object.keys(formData).map(key => [key, ''])));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              {/* Form Header */}
              <div className="text-center mb-5">
                <h1 className="h2 fw-bold text-dark mb-3">
                  <i className="fas fa-user-edit me-2 text-primary"></i>
                  Car Rental Application
                </h1>
                <p className="text-muted mb-0">Please fill in all required information</p>
                {userData && (
                  <div className="alert alert-success mt-3 border-0 rounded-3">
                    <i className="fas fa-check-circle me-2"></i>
                    User data pre-filled from your profile
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-user me-2"></i>
                      Personal Information
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label fw-medium">First Name <span className="text-danger">*</span></label>
                        <input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label fw-medium">Last Name <span className="text-danger">*</span></label>
                        <input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="birthDate" className="form-label fw-medium">Date of Birth <span className="text-danger">*</span></label>
                        <input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-medium">Email Address <span className="text-danger">*</span></label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-phone me-2"></i>
                      Contact Information
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="cell" className="form-label fw-medium">Mobile Phone <span className="text-danger">*</span></label>
                        <input
                          id="cell"
                          name="cell"
                          type="tel"
                          value={formData.cell}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="homePhone" className="form-label fw-medium">Home Phone</label>
                        <input
                          id="homePhone"
                          name="homePhone"
                          type="tel"
                          value={formData.homePhone}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Address Information
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="address1" className="form-label fw-medium">Street Address <span className="text-danger">*</span></label>
                        <input
                          id="address1"
                          name="address1"
                          value={formData.address1}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="address2" className="form-label fw-medium">Apt/Suite/Other</label>
                        <input
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label fw-medium">City <span className="text-danger">*</span></label>
                        <input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="zip" className="form-label fw-medium">ZIP/Postal Code <span className="text-danger">*</span></label>
                        <input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-credit-card me-2"></i>
                      Payment Information
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="CreditCardType" className="form-label fw-medium">Credit Card Type <span className="text-danger">*</span></label>
                        <select
                          id="CreditCardType"
                          name="CreditCardType"
                          value={formData.CreditCardType}
                          onChange={handleChange}
                          className="form-select form-select-lg"
                          required
                        >
                          <option value="">Select card type</option>
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                          <option value="amex">American Express</option>
                          <option value="discover">Discover</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="CreditCardNo" className="form-label fw-medium">Credit Card Number <span className="text-danger">*</span></label>
                        <input
                          id="CreditCardNo"
                          name="CreditCardNo"
                          value={formData.CreditCardNo}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driving License Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-id-card me-2"></i>
                      Driving License
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="drivingLicense" className="form-label fw-medium">License Number <span className="text-danger">*</span></label>
                        <input
                          id="drivingLicense"
                          name="drivingLicense"
                          value={formData.drivingLicense}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="dlIssuedBy" className="form-label fw-medium">Issued By <span className="text-danger">*</span></label>
                        <input
                          id="dlIssuedBy"
                          name="dlIssuedBy"
                          value={formData.dlIssuedBy}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="dlValidThru" className="form-label fw-medium">Expiration Date <span className="text-danger">*</span></label>
                        <input
                          id="dlValidThru"
                          name="dlValidThru"
                          type="date"
                          value={formData.dlValidThru}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Driving Permit Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-passport me-2"></i>
                      International Driving Permit
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="idpNo" className="form-label fw-medium">IDP Number</label>
                        <input
                          id="idpNo"
                          name="idpNo"
                          value={formData.idpNo}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="idpIssuedBy" className="form-label fw-medium">Issued By</label>
                        <input
                          id="idpIssuedBy"
                          name="idpIssuedBy"
                          value={formData.idpIssuedBy}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="idpValidThru" className="form-label fw-medium">Expiration Date</label>
                        <input
                          id="idpValidThru"
                          name="idpValidThru"
                          type="date"
                          value={formData.idpValidThru}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passport Section */}
                <div className="card mb-4 border-0 bg-light rounded-4">
                  <div className="card-header bg-primary text-white rounded-top-4">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-globe me-2"></i>
                      Passport Information
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="passportNo" className="form-label fw-medium">Passport Number</label>
                        <input
                          id="passportNo"
                          name="passportNo"
                          value={formData.passportNo}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="passportIssuedBy" className="form-label fw-medium">Issuing Country</label>
                        <input
                          id="passportIssuedBy"
                          name="passportIssuedBy"
                          value={formData.passportIssuedBy}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="passportValid" className="form-label fw-medium">Expiration Date</label>
                        <input
                          id="passportValid"
                          name="passportValid"
                          type="date"
                          value={formData.passportValid}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm"
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn btn-secondary btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm"
                  >
                    <i className="fas fa-eraser me-2"></i>
                    Clear Form
                  </button>
                  <button
                    type="button"
                    onClick={onClearBooking}
                    className="btn btn-info btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Start New Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}