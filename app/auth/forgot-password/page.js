'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate API call - replace with your actual password reset API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email address.');
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-3">
                    <i className="bi bi-lock text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-2">Forgot Password</h1>
                  <p className="text-muted mb-0">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {/* Success Message */}
                {message && (
                  <div className="alert alert-success mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {message}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary btn-lg fw-bold"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Send Reset Instructions
                        </>
                      )}
                    </button>
                  </div>

                  {/* Back to Login */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Remember your password? 
                      <Link href="/auth/login" className="text-decoration-none ms-1 fw-semibold">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-5 pt-4 border-top">
                  <p className="text-muted small mb-0">
                    Need help? Contact our 
                    <Link href="/contact-us" className="text-decoration-none ms-1">support team</Link>
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