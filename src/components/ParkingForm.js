import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function ParkingForm({ onAdded, token }) {
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/parking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ number, location })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add spot');
      }

      setNumber('');
      setLocation('');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">➕ Add Parking Spot</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Spot Number *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., P-001"
              value={number}
              onChange={e => setNumber(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Level 1 - Row A"
              value={location}
              onChange={e => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Adding...' : 'Add Spot'}
          </button>
        </form>
      </div>
    </div>
  );
}
