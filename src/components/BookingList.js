import React from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function BookingList({ bookings, onRefresh, token, userRole }) {
  const [cancelingId, setCancelingId] = React.useState(null);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking and free the spot?')) return;

    setCancelingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to cancel booking');
      }

      if (onRefresh) onRefresh();
      alert('Booking cancelled successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">📋 Active Bookings ({bookings.length})</h5>
      </div>
      <div className="card-body">
        {bookings.length === 0 && (
          <div className="alert alert-info mb-0">No active bookings yet.</div>
        )}

        {bookings.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Vehicle</th>
                  <th>Parking Spot</th>
                  <th>Location</th>
                  <th>Booked At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.vehicleNumber}</strong>
                    </td>
                    <td>
                      <span className="badge bg-primary">{booking.spot?.number ?? '—'}</span>
                    </td>
                    <td>
                      <small className="text-muted">{booking.spot?.location ?? '—'}</small>
                    </td>
                    <td>
                      <small>{new Date(booking.startTime).toLocaleString()}</small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancelingId === booking._id}
                      >
                        {cancelingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
