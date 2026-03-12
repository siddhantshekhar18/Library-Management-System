import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Cancel() {
  const { getHomeRoute } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/transactions';

  return (
    <div className="result-page">
      <div className="result-card">
        <span className="result-icon">❌</span>
        <h2 style={{ color: 'var(--danger)' }}>Transaction Cancelled</h2>
        <p>The transaction has been cancelled. No changes were saved.</p>
        <div className="result-actions">
          <button className="btn btn-secondary" onClick={() => navigate(from)}>
            ↩ Continue
          </button>
          <button className="btn btn-primary" onClick={() => navigate(getHomeRoute())}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
