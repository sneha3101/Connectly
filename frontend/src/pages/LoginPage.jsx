import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setUser, setToken } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-frame">
        <Link to="/" className="brand-lockup login-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <span>Connectly</span>
        </Link>

        <div className="login-welcome">
          <h1>Welcome <span>Back!</span></h1>
          <p>Glad to see you again.</p>
          <div className="bubble-illustration" aria-hidden="true">
            <span></span>
            <span></span>
          </div>
        </div>

        <form className="login-panel" onSubmit={handleSubmit}>
          <h2>Login to your account</h2>
          {error && <div className="error compact-error">{error}</div>}

          <label>
            <span>Email or Username</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
            />
          </label>

          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span aria-hidden="true">⊙</span>
            </div>
          </label>

          <div className="login-options">
            <label className="remember-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="signup-copy">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
