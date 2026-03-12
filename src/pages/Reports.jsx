import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function Reports() {
  const { getHomeRoute } = useApp();

  return (
    <div className="page">
      <PageHeader
        title="Reports"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">📑 Reports</div>
        <div className="report-list">
          <Link to="/master-books" className="report-item">
            <div className="r-icon">📚</div>
            <h3>Master List of Books</h3>
          </Link>
          <Link to="/master-movies" className="report-item">
            <div className="r-icon">🎬</div>
            <h3>Master List of Movies</h3>
          </Link>
          <Link to="/master-memberships" className="report-item">
            <div className="r-icon">👥</div>
            <h3>Master List of Memberships</h3>
          </Link>
          <Link to="/active-issues" className="report-item">
            <div className="r-icon">🔄</div>
            <h3>Active Issues</h3>
          </Link>
          <Link to="/overdue-returns" className="report-item">
            <div className="r-icon">⏰</div>
            <h3>Overdue Returns</h3>
          </Link>
          <Link to="/issue-requests" className="report-item">
            <div className="r-icon">📝</div>
            <h3>Pending Issue Requests</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
