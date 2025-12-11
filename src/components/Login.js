import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function Login({ onLoginSuccess, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">🅿️ Car Parking Management</h4>
              </div>
              <div className="card-body p-4">
                <h5 className="mb-4">Login</h5>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <hr />
                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={onRegisterClick}
                  >
                    Create New Account
                  </button>
                </div>
                <small className="text-muted">
                  <strong>Demo Credentials:</strong>
                  <div>Admin: admin@carparking.com / admin123</div>
                  <div>Attendant: attendant@carparking.com / attendant123</div>
                  <div>User: user1@example.com / user123</div>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
