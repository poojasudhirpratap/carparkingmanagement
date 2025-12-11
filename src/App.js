import React, { useEffect, useState, useCallback } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ParkingForm from './components/ParkingForm';
import ParkingList from './components/ParkingList';
import BookingList from './components/BookingList';
import UserManagement from './components/UserManagement';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [spots, setSpots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const fetchSpots = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/parking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSpots(data);
      }
    } catch (err) {
      console.error('Error fetching spots:', err);
    }
  }, [token]);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSpots();
      fetchBookings();
    }
  }, [token,fetchBookings,fetchSpots]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setSpots([]);
    setBookings([]);
  };

  const handleRefresh = () => {
    fetchSpots();
    fetchBookings();
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  // Show login page if not authenticated
  if (!user || !token) {
    if (showRegister) {
      return <Register isAdmin={false} onRegistrationSuccess={() => setShowRegister(false)} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onRegisterClick={() => setShowRegister(true)} />;
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h5">🅿️ Car Parking Management</span>
          <div className="d-flex gap-2 align-items-center">
            <div className="text-white me-3">
              <small>
                <strong>{user.name}</strong> 
                <br />
                <span className="badge bg-light text-primary">{user.role}</span>
              </small>
            </div>
            <button className="btn btn-sm btn-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        {/* Admin: User Management */}
        {user.role === 'admin' && (
          <div className="row mb-4">
            <div className="col-12">
              <UserManagement token={token} />
            </div>
          </div>
        )}

        {/* Parking Management: Admin & Attendant */}
        {(user.role === 'admin' || user.role === 'attendant') && (
          <div className="row g-4 mb-4">
            <div className="col-lg-5">
              <ParkingForm onAdded={handleRefresh} token={token} />
            </div>
            <div className="col-lg-7">
              <ParkingList spots={spots} onRefresh={handleRefresh} token={token} />
            </div>
          </div>
        )}

        {/* Parking View: All Users */}
        {(user.role === 'user') && (
          <div className="row mb-4">
            <div className="col-12">
              <ParkingList spots={spots} onRefresh={handleRefresh} token={token} />
            </div>
          </div>
        )}

        {/* Bookings */}
        <div className="row">
          <div className="col-12">
            <BookingList bookings={bookings} onRefresh={handleRefresh} token={token} userRole={user.role} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-5">
        <small className="text-muted">Car Parking Management System © 2025 | Logged in as {user.role}</small><br/>
        <small className="text-muted">DEVELOPED BY SUDHIR KUMAR</small>
      </footer>
    </div>
  );
}

export default App;
