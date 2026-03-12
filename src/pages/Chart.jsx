import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CATEGORIES } from '../data/initialData.js';

export default function Chart() {
  const { items, memberships, issues, getHomeRoute } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  // Stats
  const totalBooks = items.filter(i => i.type === 'Book').length;
  const totalMovies = items.filter(i => i.type === 'Movie').length;
  const availableItems = items.filter(i => i.status === 'Available').length;
  const issuedItems = items.filter(i => i.status === 'Issued').length;
  const activeMemberships = memberships.filter(m => m.status === 'Active').length;
  const activeIssues = issues.filter(i => i.status === 'Active' || i.status === 'Overdue').length;
  const overdueIssues = issues.filter(i => (i.status === 'Active' || i.status === 'Overdue') && i.returnDate < today).length;
  const totalFines = memberships.reduce((sum, m) => sum + (m.fineAmount || 0), 0);

  // Category distribution
  const byCategory = CATEGORIES.map(cat => ({
    category: cat,
    books: items.filter(i => i.type === 'Book' && i.category === cat).length,
    movies: items.filter(i => i.type === 'Movie' && i.category === cat).length,
    total: items.filter(i => i.category === cat).length,
  }));

  const maxCatTotal = Math.max(...byCategory.map(c => c.total), 1);

  // Issue status distribution
  const issueStatuses = [
    { label: 'Active', count: issues.filter(i => i.status === 'Active').length, color: 'var(--primary)' },
    { label: 'Overdue', count: issues.filter(i => i.status === 'Overdue' || (i.status === 'Active' && i.returnDate < today)).length, color: 'var(--danger)' },
    { label: 'Returned', count: issues.filter(i => i.status === 'Returned').length, color: 'var(--success)' },
    { label: 'Fine Pending', count: issues.filter(i => i.status === 'Fine Pending').length, color: 'var(--warning)' },
  ];
  const maxIssueCount = Math.max(...issueStatuses.map(i => i.count), 1);

  const Bar = ({ value, max, color }) => (
    <div className="chart-bar-track">
      <div
        className="chart-bar-fill"
        style={{ width: `${Math.round((value / max) * 100)}%`, background: color }}
      />
    </div>
  );

  return (
    <div className="page">
      <PageHeader
        title="Library Statistics"
        links={[{ label: '🏠 Home', to: getHomeRoute() }]}
      />
      <div className="content">
        <div className="page-title">📊 Library Statistics & Charts</div>

        {/* Summary stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">{totalBooks}</div>
            <div className="stat-label">📚 Total Books</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{totalMovies}</div>
            <div className="stat-label">🎬 Total Movies</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--success)' }}>{availableItems}</div>
            <div className="stat-label">✅ Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--info)' }}>{issuedItems}</div>
            <div className="stat-label">📤 Currently Issued</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--primary)' }}>{activeMemberships}</div>
            <div className="stat-label">👥 Active Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--danger)' }}>{overdueIssues}</div>
            <div className="stat-label">⏰ Overdue Items</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
          {/* Category Chart */}
          <div className="card">
            <div className="card-title">📊 Items by Category</div>
            {byCategory.map(cat => (
              <div key={cat.category} className="chart-bar-container">
                <div className="chart-label">
                  <span>{cat.category}</span>
                  <span>{cat.books}B + {cat.movies}M = <strong>{cat.total}</strong></span>
                </div>
                <Bar value={cat.total} max={maxCatTotal} color="var(--primary)" />
              </div>
            ))}
          </div>

          {/* Issue Status Chart */}
          <div className="card">
            <div className="card-title">📈 Issue Status Distribution</div>
            {issueStatuses.map(status => (
              <div key={status.label} className="chart-bar-container">
                <div className="chart-label">
                  <span>{status.label}</span>
                  <strong>{status.count}</strong>
                </div>
                <Bar value={status.count} max={maxIssueCount} color={status.color} />
              </div>
            ))}
          </div>

          {/* Item Status Chart */}
          <div className="card">
            <div className="card-title">📋 Item Status</div>
            {['Available', 'Issued', 'Lost', 'Damaged'].map(status => {
              const count = items.filter(i => i.status === status).length;
              const colors = { Available: 'var(--success)', Issued: 'var(--info)', Lost: '#c05621', Damaged: 'var(--warning)' };
              return (
                <div key={status} className="chart-bar-container">
                  <div className="chart-label">
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${Math.round((count / items.length) * 100)}%`, background: colors[status] }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Membership Stats */}
          <div className="card">
            <div className="card-title">👥 Membership Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Total Members', value: memberships.length, color: 'var(--primary)' },
                { label: 'Active', value: activeMemberships, color: 'var(--success)' },
                { label: 'Inactive', value: memberships.filter(m => m.status === 'Inactive').length, color: 'var(--text-muted)' },
                { label: 'Total Fine Pending', value: `₹${memberships.reduce((s, m) => s + m.fineAmount, 0)}`, color: 'var(--danger)' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category breakdown table */}
        <div className="card">
          <div className="card-title">📋 Detailed Category Breakdown</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Books</th>
                  <th>Movies</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Issued</th>
                  <th>Lost/Damaged</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map(cat => {
                  const catItems = items.filter(i => i.category === cat);
                  return (
                    <tr key={cat}>
                      <td><strong>{cat}</strong></td>
                      <td>{catItems.filter(i => i.type === 'Book').length}</td>
                      <td>{catItems.filter(i => i.type === 'Movie').length}</td>
                      <td><strong>{catItems.length}</strong></td>
                      <td style={{ color: 'var(--success)' }}>{catItems.filter(i => i.status === 'Available').length}</td>
                      <td style={{ color: 'var(--info)' }}>{catItems.filter(i => i.status === 'Issued').length}</td>
                      <td style={{ color: 'var(--warning)' }}>{catItems.filter(i => i.status === 'Lost' || i.status === 'Damaged').length}</td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: 700, background: 'var(--bg)' }}>
                  <td>TOTAL</td>
                  <td>{items.filter(i => i.type === 'Book').length}</td>
                  <td>{items.filter(i => i.type === 'Movie').length}</td>
                  <td>{items.length}</td>
                  <td style={{ color: 'var(--success)' }}>{availableItems}</td>
                  <td style={{ color: 'var(--info)' }}>{issuedItems}</td>
                  <td style={{ color: 'var(--warning)' }}>{items.filter(i => i.status === 'Lost' || i.status === 'Damaged').length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
          <button className="btn btn-primary" onClick={() => navigate(getHomeRoute())}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
