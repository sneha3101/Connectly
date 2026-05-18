import React, { useState, useEffect } from 'react';
import { profileAPI, connectionAPI } from '../utils/api';
import Navbar from '../components/Navbar';

const interestOptions = [
  'Technology', 'Sports', 'Music', 'Movies', 'Books', 'Travel',
  'Gaming', 'Cooking', 'Art', 'Science', 'Business', 'Health',
];

const DashboardPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getAllProfiles();
      setProfiles(response.data.profiles);
      setFilteredProfiles(response.data.profiles);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestFilter = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(updated);

    if (updated.length === 0) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile =>
      updated.some(selectedInterest => profile.interests.includes(selectedInterest))
    );
    setFilteredProfiles(filtered);
  };

  const handleConnect = async (receiverId) => {
    try {
      await connectionAPI.sendRequest({ receiverId });
      alert('Connection request sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <div className="page-header animate-in">
          <h1>Discover People</h1>
          <p>Find people who share your interests and thoughts</p>
        </div>

        <div className="discover-layout">
          <section className="filter-panel panel animate-in stagger-1">
            <h3>Filter by Interests</h3>
            <div className="filter-grid">
              {interestOptions.map(interest => (
                <label key={interest} className="chip-check">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestFilter(interest)}
                  />
                  <span className="chip-text">{interest}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="discover-results">
            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="profiles-grid">
                {filteredProfiles.length === 0 ? (
                  <p className="no-results">No profiles found. Try adjusting your filters.</p>
                ) : (
                  filteredProfiles.map((profile, index) => (
                    <article key={profile._id} className={`profile-card stagger-${(index % 4) + 1}`}>
                      <div className="profile-card-header">
                        <h3 className="alias">{profile.userId.alias}</h3>
                        <span
                          className="status-pill"
                          style={{ backgroundColor: profile.userId.isOnline ? '#16a34a' : '#94a3b8' }}
                        >
                          {profile.userId.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <p className="catch-line">{profile.catchLine}</p>

                      <div className="interest-list">
                        {profile.interests.slice(0, 3).map(interest => (
                          <span key={interest} className="interest-tag">{interest}</span>
                        ))}
                        {profile.interests.length > 3 && (
                          <span className="more-tag">+{profile.interests.length - 3}</span>
                        )}
                      </div>

                      <button onClick={() => handleConnect(profile.userId._id)} className="primary-button">
                        Connect
                      </button>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
