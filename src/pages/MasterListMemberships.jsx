import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function MasterListMemberships() {
  const { memberships, getHomeRoute } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = memberships.filter(m =>
    (!filter ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(filter.toLowerCase()) ||
      m.contactNumber.includes(filter)
    ) &&
    (!statusFilter || m.status === statusFilter)
  );

  return (
    <div className="page">
      <PageHeader
        title="Master List of Memberships"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '📑 Reports', to: '/reports' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">👥 Master List of Memberships</div>

        <div className="filter-bar">
          <div className="filter-row">
            <div className="form-group">
              <label>Search</label>
              <input
                className="form-control"
                placeholder="Search by name, ID, contact..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setFilter(''); setStatusFilter(''); }}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}><strong>{filtered.length}</strong> membership(s) found</span>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            {filtered.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">📭</span><p>No memberships found.</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Membership ID</th>
                    <th>Name of Member</th>
                    <th>Contact Number</th>
                    <th>Contact Address</th>
                    <th>Aadhar Card No</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Amount Pending (Fine)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.membershipId}>
                      <td><code>{m.membershipId}</code></td>
                      <td>{m.firstName} {m.lastName}</td>
                      <td>{m.contactNumber}</td>
                      <td style={{ maxWidth: 200, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.address}</td>
                      <td>{m.aadharNo}</td>
                      <td>{m.startDate}</td>
                      <td>{m.endDate}</td>
                      <td>
                        <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                      </td>
                      <td>
                        <span style={{ color: m.fineAmount > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                          ₹{m.fineAmount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>← Back to Reports</button>
          <button className="btn btn-primary" onClick={() => navigate('/add-membership')}>+ Add Membership</button>
        </div>
      </div>
    </div>
  );
}
