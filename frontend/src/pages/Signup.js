import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>🎓 Create Your Account</h2>
          <p>Join TikLink and start studying smarter</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              disabled={loading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <p className="hint">Use at least 6 characters with letters and numbers</p>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="error-message">
              ❌ {serverError}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-btn"
          >
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>

          {/* Terms */}
          <p className="terms">
            By signing up, you agree to our Terms of Service
          </p>
        </form>

        {/* Login Link */}
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      {/* Background decoration */}
      <div className="decoration-circle decoration-1"></div>
      <div className="decoration-circle decoration-2"></div>
    </div>
  );
}

export default Signup;