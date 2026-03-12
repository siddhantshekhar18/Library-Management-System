import React from 'react';
import { Link } from 'react-router-dom';

export default function Logout() {
  return (
    <div className="result-page" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
      <div className="result-card">
        <span className="result-icon">🚪</span>
        <h2 style={{ color: 'var(--primary)' }}>You have successfully logged out.</h2>
        <p>Thank you for using the Library Management System.</p>
        <div className="result-actions">
          <Link to="/admin-login" className="btn btn-primary">
            🔐 Admin Login
          </Link>
          <Link to="/user-login" className="btn btn-outline">
            👤 User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
