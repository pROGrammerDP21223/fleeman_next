'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cell: '',
    homePhone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    birthDate: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    idpNumber: '',
    idpIssuedBy: '',
    idpExpiry: '',
    passportNumber: '',
    passportIssuedBy: '',
    passportExpiry: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        ...user
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    if (!formData.cell) newErrors.cell = 'Cell phone is required';
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone format validation (simple check)
    const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/;
    if (formData.cell && !phoneRegex.test(formData.cell)) {
      newErrors.cell = 'Please enter a valid phone number';
    }
    if (formData.homePhone && !phoneRegex.test(formData.homePhone)) {
      newErrors.homePhone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous messages
    setApiError('');
    setSuccessMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully');
        window.scrollTo(0, 0); // Scroll to top to show success message
      } else {
        setApiError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="search-box-banner shadow">
        {/* Form Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-sm text-gray-600">View and update your personal information</p>
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-block">
                <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className={`form-control ${errors.firstName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div className="input-block">
                <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className={`form-control ${errors.lastName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              
              <div className="input-block">
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="input-block">
                <label htmlFor="birthDate" className="block text-xs font-semibold text-gray-700 mb-1">Birth Date</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-block">
                <label htmlFor="cell" className="block text-xs font-semibold text-gray-700 mb-1">Cell Phone</label>
                <input
                  id="cell"
                  name="cell"
                  type="tel"
                  value={formData.cell || ''}
                  onChange={handleChange}
                  className={`form-control ${errors.cell ? 'border-red-500' : ''}`}
                  required
                />
                {errors.cell && <p className="text-red-500 text-xs mt-1">{errors.cell}</p>}
              </div>
              
              <div className="input-block">
                <label htmlFor="homePhone" className="block text-xs font-semibold text-gray-700 mb-1">Home Phone</label>
                <input
                  id="homePhone"
                  name="homePhone"
                  type="tel"
                  value={formData.homePhone || ''}
                  onChange={handleChange}
                  className={`form-control ${errors.homePhone ? 'border-red-500' : ''}`}
                />
                {errors.homePhone && <p className="text-red-500 text-xs mt-1">{errors.homePhone}</p>}
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Address Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="input-block">
                <label htmlFor="address1" className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1</label>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  value={formData.address1 || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="address2" className="block text-xs font-semibold text-gray-700 mb-1">Address Line 2</label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  value={formData.address2 || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="input-block">
                <label htmlFor="city" className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="state" className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="zip" className="block text-xs font-semibold text-gray-700 mb-1">Zip Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  value={formData.zip || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          {/* Driving License Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Driving License Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="input-block">
                <label htmlFor="licenseNumber" className="block text-xs font-semibold text-gray-700 mb-1">License Number</label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="licenseState" className="block text-xs font-semibold text-gray-700 mb-1">Issued By</label>
                <input
                  id="licenseState"
                  name="licenseState"
                  type="text"
                  value={formData.licenseState || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="licenseExpiry" className="block text-xs font-semibold text-gray-700 mb-1">Expiration Date</label>
                <input
                  id="licenseExpiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          {/* International Driving Permit */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">International Driving Permit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="input-block">
                <label htmlFor="idpNumber" className="block text-xs font-semibold text-gray-700 mb-1">IDP Number</label>
                <input
                  id="idpNumber"
                  name="idpNumber"
                  type="text"
                  value={formData.idpNumber || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="idpIssuedBy" className="block text-xs font-semibold text-gray-700 mb-1">Issued By</label>
                <input
                  id="idpIssuedBy"
                  name="idpIssuedBy"
                  type="text"
                  value={formData.idpIssuedBy || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="idpExpiry" className="block text-xs font-semibold text-gray-700 mb-1">Expiration Date</label>
                <input
                  id="idpExpiry"
                  name="idpExpiry"
                  type="date"
                  value={formData.idpExpiry || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          {/* Passport Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Passport Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="input-block">
                <label htmlFor="passportNumber" className="block text-xs font-semibold text-gray-700 mb-1">Passport Number</label>
                <input
                  id="passportNumber"
                  name="passportNumber"
                  type="text"
                  value={formData.passportNumber || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="passportIssuedBy" className="block text-xs font-semibold text-gray-700 mb-1">Issuing Country</label>
                <input
                  id="passportIssuedBy"
                  name="passportIssuedBy"
                  type="text"
                  value={formData.passportIssuedBy || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="input-block">
                <label htmlFor="passportExpiry" className="block text-xs font-semibold text-gray-700 mb-1">Expiration Date</label>
                <input
                  id="passportExpiry"
                  name="passportExpiry"
                  type="date"
                  value={formData.passportExpiry || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="search-button bg-[#FFA633] hover:bg-[#FFB300] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}