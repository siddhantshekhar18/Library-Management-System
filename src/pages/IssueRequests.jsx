import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function IssueRequests() {
  const { issueRequests, items, memberships, getHomeRoute } = useApp();
  const navigate = useNavigate();

  const getItemName = (serialNo) => items.find(i => i.serialNo === serialNo)?.name || serialNo;
  const getMemberName = (membershipId) => {
    const m = memberships.find(m => m.membershipId === membershipId);
    return m ? `${m.firstName} ${m.lastName}` : membershipId;
  };

  const pending = issueRequests.filter(r => r.status === 'Pending');
  const fulfilled = issueRequests.filter(r => r.status === 'Fulfilled');

  const renderTable = (requests, title) => (
    <>
      <h3 className="section-title">{title} ({requests.length})</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        {requests.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📭</span><p>No requests.</p></div>
        ) : (
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Membership ID</th>
                  <th>Member Name</th>
                  <th>Book/Movie Name</th>
                  <th>Serial No</th>
                  <th>Requested Date</th>
                  <th>Request Fulfilled Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.requestId}>
                    <td><code>{r.requestId}</code></td>
                    <td><code>{r.membershipId}</code></td>
                    <td>{getMemberName(r.membershipId)}</td>
                    <td>{getItemName(r.serialNo)}</td>
                    <td><code>{r.serialNo}</code></td>
                    <td>{r.requestDate}</td>
                    <td>{r.fulfilledDate || <span className="text-muted">—</span>}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="page">
      <PageHeader
        title="Issue Requests"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '📑 Reports', to: '/reports' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">📝 Issue Requests</div>
        {renderTable(pending, '⏳ Pending Requests')}
        {renderTable(fulfilled, '✅ Fulfilled Requests')}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>← Back to Reports</button>
        </div>
      </div>
    </div>
  );
}
