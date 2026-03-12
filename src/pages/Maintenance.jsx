import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

export default function Maintenance() {
  return (
    <div className="page">
      <PageHeader
        title="Maintenance"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">🔧 Maintenance</div>

        <div className="maint-section">
          <h3>👥 Membership</h3>
          <div className="maint-grid">
            <Link to="/add-membership" className="maint-btn">
              <span className="m-icon">➕</span>
              Add Membership
            </Link>
            <Link to="/update-membership" className="maint-btn">
              <span className="m-icon">✏️</span>
              Update Membership
            </Link>
          </div>
        </div>

        <div className="maint-section">
          <h3>📚 Books / Movies</h3>
          <div className="maint-grid">
            <Link to="/add-book-movie" className="maint-btn">
              <span className="m-icon">➕</span>
              Add Book / Movie
            </Link>
            <Link to="/update-book-movie" className="maint-btn">
              <span className="m-icon">✏️</span>
              Update Book / Movie
            </Link>
          </div>
        </div>

        <div className="maint-section">
          <h3>👤 User Management</h3>
          <div className="maint-grid">
            <Link to="/user-management" className="maint-btn">
              <span className="m-icon">➕</span>
              Add User
            </Link>
            <Link to="/user-management" className="maint-btn">
              <span className="m-icon">✏️</span>
              Update User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
