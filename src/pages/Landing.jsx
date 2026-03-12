import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Landing() {
  const { currentUser, getHomeRoute, backendConnected, backendMessage } = useApp();

  return (
    <div className="landing-page">
      <div className="landing-box">
        <span className="lib-icon">📚</span>
        <h1>Library Management System</h1>
        <p>Welcome! Please choose your login type to continue.</p>
        <div className={`alert ${backendConnected ? 'alert-success' : 'alert-warning'}`} style={{ textAlign: 'left' }}>
          <span>{backendConnected ? '🟢' : '🟡'}</span> {backendMessage}
        </div>
        <div className="login-choice">
          <Link to="/admin-login" className="btn btn-primary btn-lg">
            🔐 Admin Login
          </Link>
          <Link to="/user-login" className="btn btn-outline btn-lg">
            👤 User Login
          </Link>
        </div>
        {currentUser && (
          <div style={{ marginTop: 24 }}>
            <Link to={getHomeRoute()} className="btn btn-success">
              ↩ Back to Home ({currentUser.name})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
