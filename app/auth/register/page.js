'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    email: '',
    city: '',
    zip: '',
    homePhone: '',
    cell: '',
    drivingLicense: '',
    dlIssuedBy: '',
    dlValidThru: '',
    idpNo: '',
    idpIssuedBy: '',
    idpValidThru: '',
    passportNo: '',
    passportIssuedBy: '',
    passportValid: '',
    birthDate: '',
    CreditCardType: '',
    CreditCardNo: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (!formData.cell) newErrors.cell = 'Mobile phone is required';
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous API errors
    setApiError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const { confirmPassword, ...userData } = formData;
      
      // Use the register function from AuthContext
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to home page or dashboard
        router.push('/');
      } else {
        setApiError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-3">
                    <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-2">Create Your Account</h1>
                  <p className="text-muted mb-0">Join us and start your journey today</p>
                </div>

                {/* API Error Alert */}
                {apiError && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Account Information Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-primary text-white rounded-top">
                      <h5 className="mb-0">
                        <i className="bi bi-shield-lock me-2"></i>
                        Account Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
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
                        <div className="col-md-6">
                          <label htmlFor="password" className="form-label fw-semibold">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Create a password"
                            required
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            Confirm Password <span className="text-danger">*</span>
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder="Confirm your password"
                            required
                          />
                          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
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

                  {/* Driving License Section */}
                  <div className="card mb-4 border-0 bg-light">
                    <div className="card-header bg-secondary text-white rounded-top">
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
                    <div className="card-header bg-dark text-white rounded-top">
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
                    <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                      <h5 className="mb-0">
                        <i className="bi bi-passport me-2"></i>
                        Passport
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
                            Issued By
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
                      disabled={isLoading}
                      className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                      style={{ minWidth: '200px' }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                    <Link href="/auth/login" className="btn btn-outline-secondary btn-lg px-5 py-3 fw-bold" style={{ minWidth: '200px' }}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Already have an account?
                    </Link>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-5 pt-4 border-top">
                  <p className="text-muted mb-0">
                    By creating an account, you agree to our 
                    <a href="#" className="text-decoration-none ms-1">Terms of Service</a> and 
                    <a href="#" className="text-decoration-none ms-1">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}