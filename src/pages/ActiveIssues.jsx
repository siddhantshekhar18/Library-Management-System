import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function ActiveIssues() {
  const { issues, items, memberships, getHomeRoute } = useApp();
  const navigate = useNavigate();

  const active = issues.filter(i => i.status === 'Active' || i.status === 'Overdue');

  const getItemName = (serialNo) => items.find(i => i.serialNo === serialNo)?.name || serialNo;
  const getItemType = (serialNo) => items.find(i => i.serialNo === serialNo)?.type || '';
  const getMemberName = (membershipId) => {
    const m = memberships.find(m => m.membershipId === membershipId);
    return m ? `${m.firstName} ${m.lastName}` : membershipId;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <PageHeader
        title="Active Issues"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '📑 Reports', to: '/reports' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">🔄 Active Issues</div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              <strong>{active.length}</strong> active issue(s) — showing items currently issued (not yet returned)
            </span>
          </div>

          {active.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">✅</span><p>No active issues at this time.</p></div>
          ) : (
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Serial No (Book/Movie)</th>
                    <th>Name of Book/Movie</th>
                    <th>Type</th>
                    <th>Membership ID</th>
                    <th>Member Name</th>
                    <th>Date of Issue</th>
                    <th>Date of Return</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map(issue => (
                    <tr key={issue.issueId}>
                      <td><code>{issue.issueId}</code></td>
                      <td><code>{issue.serialNo}</code></td>
                      <td>{getItemName(issue.serialNo)}</td>
                      <td>{getItemType(issue.serialNo)}</td>
                      <td><code>{issue.membershipId}</code></td>
                      <td>{getMemberName(issue.membershipId)}</td>
                      <td>{issue.issueDate}</td>
                      <td style={{ color: issue.returnDate < today ? 'var(--danger)' : 'inherit', fontWeight: issue.returnDate < today ? 700 : 400 }}>
                        {issue.returnDate}
                      </td>
                      <td>
                        <span className={`badge badge-${issue.returnDate < today ? 'overdue' : 'issued'}`}>
                          {issue.returnDate < today ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>← Back to Reports</button>
        </div>
      </div>
    </div>
  );
}
