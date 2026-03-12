import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function PageHeader({ title, links = [] }) {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <header className="page-header">
      <h1>
        <span className="icon">📚</span>
        {title || 'Library Management System'}
      </h1>
      <nav className="header-nav">
        {links.map((link, i) => (
          <React.Fragment key={`${link.label}-${link.to || i}`}>
            {i > 0 && <span className="sep">|</span>}
            {link.to ? (
              <Link to={link.to}>{link.label}</Link>
            ) : (
              <span>{link.label}</span>
            )}
          </React.Fragment>
        ))}
        {links.length > 0 && <span className="sep">|</span>}
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </nav>
    </header>
  );
}
