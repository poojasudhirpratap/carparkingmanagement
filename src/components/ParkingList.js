import React from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function ParkingList({ spots, onRefresh, token }) {
  const [selectedSpotId, setSelectedSpotId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const bookSpot = async (spotId) => {
    setSelectedSpotId(spotId);
    const vNumber = prompt('Enter vehicle number (e.g., ABC-1234):');
    
    if (!vNumber) {
      setSelectedSpotId(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ spotId, vehicleNumber: vNumber })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to book spot');
      }

      if (onRefresh) onRefresh();
      alert('Spot booked successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
      setSelectedSpotId(null);
    }
  };

  const availableSpots = spots.filter(s => !s.occupied);
  const occupiedSpots = spots.filter(s => s.occupied);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">🅿️ Parking Spots</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-6">
            <small className="text-success fw-bold">Available: {availableSpots.length}</small>
          </div>
          <div className="col-6">
            <small className="text-danger fw-bold">Occupied: {occupiedSpots.length}</small>
          </div>
        </div>

        {spots.length === 0 && (
          <div className="alert alert-info mb-0">No parking spots available. Add one to get started.</div>
        )}

        {spots.length > 0 && (
          <div className="list-group">
            {spots.map(spot => (
              <div key={spot._id} className={`list-group-item ${spot.occupied ? 'bg-light' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">
                      <strong>{spot.number}</strong>
                      {spot.occupied && <span className="badge bg-danger ms-2">Occupied</span>}
                      {!spot.occupied && <span className="badge bg-success ms-2">Available</span>}
                    </h6>
                    <small className="text-muted">{spot.location}</small>
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => bookSpot(spot._id)}
                    disabled={spot.occupied || loading}
                  >
                    {loading && selectedSpotId === spot._id ? 'Booking...' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
