import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function AdminLogin() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('adm');
  const [password, setPassword] = useState('adm');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(userId.trim(), password);
    if (result.success) {
      if (result.user.role !== 'admin') {
        setError('This account does not have admin privileges.');
        return;
      }
      navigate('/admin-home');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <span className="lib-icon">📚</span>
          <h1>Library Management System</h1>
          <p>Admin Login</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userId">User ID <span className="req">*</span></label>
            <input
              id="userId"
              className="form-control"
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Enter admin user ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password <span className="req">*</span></label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-actions">
            <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              🔑 Login
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/chart" className="text-muted" style={{ fontSize: '0.85rem' }}>
            📊 View Chart (Demo)
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/user-login" style={{ fontSize: '0.85rem' }}>
            Switch to User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
