import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function Register({ isAdmin = false, token = null, onRegistrationSuccess = null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!isAdmin && role !== 'user') {
      setError('Non-admin users can only register as user');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = isAdmin && token ? '/api/auth/admin/register' : '/api/auth/register';
      const body = {
        name,
        email,
        password,
        role: isAdmin && token ? role : 'user'
      };

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      if (isAdmin && token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      options.body = JSON.stringify(body);

      const res = await fetch(`${API_BASE}${endpoint}`, options);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Registration failed');
      }

      const data = await res.json();
      
      setSuccess(`User registered successfully as ${data.user.role}!`);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');

      // If admin registration and callback provided, notify
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess(data.user);
        }, 1500);
      } else {
        // Auto-login for regular registration
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    // Public Registration Page
    return (
      <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow-lg">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">🅿️ Create Account</h4>
                </div>
                <div className="card-body p-4">
                  <h5 className="mb-4">Sign Up</h5>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      {success}
                      <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password (min 6 chars)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>

                  <div className="text-center">
                    <small className="text-muted">
                      Already have an account? Go back to login.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Registration Modal/Form
  return (
    <div className="card card-body">
      <h5 className="mb-3">Register New User</h5>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Confirm"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select form-select-sm"
                value={role}
                onChange={e => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="attendant">Attendant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">&nbsp;</label>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register User'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
