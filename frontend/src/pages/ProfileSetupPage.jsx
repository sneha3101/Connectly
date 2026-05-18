import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../utils/api';
import { getUser } from '../utils/auth';

const interestOptions = [
  'Technology', 'Sports', 'Music', 'Movies', 'Books', 'Travel',
  'Gaming', 'Cooking', 'Art', 'Science', 'Business', 'Health',
  'Fashion', 'Photography', 'Writing', 'Philosophy',
];

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [formData, setFormData] = useState({
    catchLine: '',
    interests: user?.interests || [],
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

    if (!formData.catchLine.trim()) {
      setError('Please enter a catch line');
      return;
    }

    try {
      setLoading(true);
      await profileAPI.upsertProfile({
        catchLine: formData.catchLine,
        interests: formData.interests,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <h1 className="auth-title">Complete Your Profile</h1>
        <p className="auth-subtitle">Set up your anonymous profile to get started</p>

        <div className="profile-info">
          <p><strong>Your Alias:</strong> {user?.alias}</p>
          <p className="help-text">This is your anonymous identity on Connectly</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Catch Line</label>
            <p className="help-text">A short phrase that describes your thoughts or interests</p>
            <textarea
              name="catchLine"
              value={formData.catchLine}
              onChange={handleChange}
              placeholder="e.g., Coffee lover who talks about technology and philosophy..."
              maxLength="150"
              rows="4"
            />
            <p className="char-count">{formData.catchLine.length}/150</p>
          </div>

          <div className="form-group">
            <label className="form-label">Your Interests</label>
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
            {loading ? 'Saving...' : 'Start Connecting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
