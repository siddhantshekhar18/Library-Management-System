import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function OverdueReturns() {
  const { issues, items, memberships, calculateFine, getHomeRoute } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const overdue = issues.filter(i =>
    (i.status === 'Active' || i.status === 'Overdue') &&
    i.returnDate < today &&
    !i.actualReturnDate
  );

  const getItemName = (serialNo) => items.find(i => i.serialNo === serialNo)?.name || serialNo;
  const getMemberName = (membershipId) => {
    const m = memberships.find(m => m.membershipId === membershipId);
    return m ? `${m.firstName} ${m.lastName}` : membershipId;
  };

  const daysDiff = (returnDate) => {
    const diff = new Date(today) - new Date(returnDate);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page">
      <PageHeader
        title="Overdue Returns"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '📑 Reports', to: '/reports' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">⏰ Overdue Returns</div>

        {overdue.length > 0 && (
          <div className="alert alert-warning">
            ⚠️ <strong>{overdue.length}</strong> item(s) are overdue and not yet returned.
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              <strong>{overdue.length}</strong> overdue return(s)
            </span>
          </div>

          {overdue.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">✅</span><p>No overdue returns. All items returned on time!</p></div>
          ) : (
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Serial No</th>
                    <th>Name of Book/Movie</th>
                    <th>Membership ID</th>
                    <th>Member Name</th>
                    <th>Date of Issue</th>
                    <th>Due Return Date</th>
                    <th>Days Overdue</th>
                    <th>Fine (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdue.map(issue => {
                    const days = daysDiff(issue.returnDate);
                    const fine = calculateFine(issue.returnDate, today);
                    return (
                      <tr key={issue.issueId}>
                        <td><code>{issue.issueId}</code></td>
                        <td><code>{issue.serialNo}</code></td>
                        <td>{getItemName(issue.serialNo)}</td>
                        <td><code>{issue.membershipId}</code></td>
                        <td>{getMemberName(issue.membershipId)}</td>
                        <td>{issue.issueDate}</td>
                        <td style={{ color: 'var(--danger)', fontWeight: 700 }}>{issue.returnDate}</td>
                        <td style={{ color: 'var(--danger)', fontWeight: 700 }}>{days} day(s)</td>
                        <td style={{ color: 'var(--danger)', fontWeight: 700 }}>₹{fine}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => navigate('/return-book')}
                          >
                            Return Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
