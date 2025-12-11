import React, { useState, useEffect } from 'react';
import Register from './Register';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (user) => {
    // Edit functionality can be implemented here
  };

  if (loading) return <div className="alert alert-info">Loading users...</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-info text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">👥 User Management</h5>
          <button className="btn btn-sm btn-light" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Add User'}
          </button>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {showForm && (
          <div className="mb-4">
            <Register isAdmin={true} token={token} onRegistrationSuccess={() => { setShowForm(false); fetchUsers(); }} />
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'attendant' ? 'warning' : 'secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${user.isActive ? 'success' : 'danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td><small>{new Date(user.createdAt).toLocaleDateString()}</small></td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => startEdit(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
