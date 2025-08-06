'use client';

import { useState } from 'react';
import '../Styles/Contact.css';
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Simulate API call - replace with your actual API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitMessage('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <h1 className="h2 fw-bold text-dark mb-2">
                                <i className="bi bi-envelope text-primary me-2"></i>
                                Contact Us
                            </h1>
                            <p className="text-muted mb-0">Get in touch with us for any questions or support</p>
                        </div>

                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="row">
                                    <div className="col-lg-6 align-self-center">
                                        <div className="contact-img text-center mb-4 mb-lg-0">
                                            <img 
                                                src="https://live.themewild.com/taxica/assets/img/contact/01.jpg" 
                                                alt="Contact Us" 
                                                className="img-fluid rounded-3 shadow"
                                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 align-self-center">
                                        <div className="contact-form">
                                            <div className="contact-form-header mb-4">
                                                <h2 className="h3 fw-bold text-dark mb-3">Get In Touch</h2>
                                                <p className="text-muted mb-0">
                                                    Have questions about our car rental services? We're here to help! 
                                                    Send us a message and we'll get back to you as soon as possible.
                                                </p>
                                            </div>
                                            
                                            <form onSubmit={handleSubmit} id="contact-form">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="name" className="form-label fw-semibold">
                                                                Your Name <span className="text-danger">*</span>
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="name"
                                                                name="name" 
                                                                placeholder="Enter your name" 
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                required 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="email" className="form-label fw-semibold">
                                                                Your Email <span className="text-danger">*</span>
                                                            </label>
                                                            <input 
                                                                type="email" 
                                                                className="form-control" 
                                                                id="email"
                                                                name="email" 
                                                                placeholder="Enter your email" 
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="form-group mt-3">
                                                    <label htmlFor="subject" className="form-label fw-semibold">
                                                        Subject <span className="text-danger">*</span>
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="subject"
                                                        name="subject" 
                                                        placeholder="Enter subject" 
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        required 
                                                    />
                                                </div>
                                                
                                                <div className="form-group mt-3">
                                                    <label htmlFor="message" className="form-label fw-semibold">
                                                        Message <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea 
                                                        name="message" 
                                                        id="message"
                                                        cols="30" 
                                                        rows="5" 
                                                        className="form-control" 
                                                        placeholder="Write your message here..."
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                    ></textarea>
                                                </div>
                                                
                                                <div className="mt-4">
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-send me-2"></i>
                                                                Send Message
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                
                                                {submitMessage && (
                                                    <div className="mt-3">
                                                        <div className={`alert ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                                                            {submitMessage}
                                                        </div>
                                                    </div>
                                                )}
                                            </form>
                                        </div>
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