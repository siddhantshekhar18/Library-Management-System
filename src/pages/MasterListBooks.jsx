import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function MasterListBooks() {
  const { items, getHomeRoute } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const books = items.filter(i => i.type === 'Book');
  const filtered = books.filter(b =>
    (!filter || b.name.toLowerCase().includes(filter.toLowerCase()) || b.author.toLowerCase().includes(filter.toLowerCase()) || b.category.toLowerCase().includes(filter.toLowerCase())) &&
    (!statusFilter || b.status === statusFilter)
  );

  const statusBadge = (status) => {
    const map = { Available: 'available', Issued: 'issued', Lost: 'lost', Damaged: 'damaged' };
    return <span className={`badge badge-${map[status] || 'issued'}`}>{status}</span>;
  };

  return (
    <div className="page">
      <PageHeader
        title="Master List of Books"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '📑 Reports', to: '/reports' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">📚 Master List of Books</div>

        <div className="filter-bar">
          <div className="filter-row">
            <div className="form-group">
              <label>Search</label>
              <input
                className="form-control"
                placeholder="Search by name, author, category..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option>Available</option>
                <option>Issued</option>
                <option>Lost</option>
                <option>Damaged</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setFilter(''); setStatusFilter(''); }}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}><strong>{filtered.length}</strong> book(s) found</span>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            {filtered.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">📭</span><p>No books found.</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Name of Book</th>
                    <th>Author Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Cost (₹)</th>
                    <th>Procurement Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.serialNo}>
                      <td><code>{b.serialNo}</code></td>
                      <td>{b.name}</td>
                      <td>{b.author}</td>
                      <td>{b.category}</td>
                      <td>{statusBadge(b.status)}</td>
                      <td>₹{b.cost}</td>
                      <td>{b.procurementDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>← Back to Reports</button>
        </div>
      </div>
    </div>
  );
}
