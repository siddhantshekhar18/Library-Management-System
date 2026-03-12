import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Confirmation() {
  const { getHomeRoute } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { message = 'Transaction completed successfully.', detail = '' } = location.state || {};

  return (
    <div className="result-page">
      <div className="result-card">
        <span className="result-icon">✅</span>
        <h2 style={{ color: 'var(--success)' }}>Transaction Completed</h2>
        <p>{message}</p>
        {detail && (
          <div className="alert alert-success" style={{ textAlign: 'left', marginBottom: 24 }}>
            {detail}
          </div>
        )}
        <div className="result-actions">
          <button className="btn btn-primary" onClick={() => navigate(getHomeRoute())}>
            🏠 Home
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/transactions')}>
            🔄 Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
