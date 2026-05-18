import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setUser, setToken } from '../utils/auth';

const interestOptions = [
  'Technology', 'Sports', 'Music', 'Movies', 'Books', 'Travel',
  'Gaming', 'Cooking', 'Art', 'Science', 'Business', 'Health',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        interests: formData.interests,
      });

      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Connectly and start connecting</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interests (Optional)</label>
            <div className="interest-grid">
              {interestOptions.map(interest => (
                <label key={interest} className="chip-check">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  <span className="chip-text">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="primary-button">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-subtitle" style={{ marginTop: '22px', marginBottom: 0, textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="text-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
