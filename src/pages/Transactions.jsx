import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function Transactions() {
  const { getHomeRoute } = useApp();

  return (
    <div className="page">
      <PageHeader
        title="Transactions"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">🔄 Transactions</div>
        <div className="trans-menu">
          <Link to="/book-available" className="trans-item">
            <div className="t-icon">🔍</div>
            <h3>Is book available?</h3>
          </Link>
          <Link to="/book-issue" className="trans-item">
            <div className="t-icon">📕</div>
            <h3>Issue book?</h3>
          </Link>
          <Link to="/return-book" className="trans-item">
            <div className="t-icon">📗</div>
            <h3>Return book?</h3>
          </Link>
          <Link to="/pay-fine" className="trans-item">
            <div className="t-icon">💰</div>
            <h3>Pay Fine?</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
