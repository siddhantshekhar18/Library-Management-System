import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function BookIssue() {
  const { items, memberships, issueBook, getHomeRoute } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.selectedBook || null;

  const availableItems = items.filter(i => i.status === 'Available');
  const uniqueNames = [...new Set(availableItems.map(i => i.name))].sort();

  const [bookName, setBookName] = useState(prefill?.name || '');
  const [selectedSerial, setSelectedSerial] = useState(prefill?.serialNo || '');
  const [author, setAuthor] = useState(prefill?.author || '');
  const [membershipId, setMembershipId] = useState('');
  const [issueDate, setIssueDate] = useState(today());
  const [returnDate, setReturnDate] = useState(addDays(today(), 15));
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  // When book name changes, populate author and serial
  useEffect(() => {
    if (bookName) {
      const matchingItems = availableItems.filter(i => i.name === bookName);
      if (matchingItems.length > 0) {
        setAuthor(matchingItems[0].author);
        setSelectedSerial(matchingItems[0].serialNo);
      }
    } else {
      setAuthor('');
      setSelectedSerial('');
    }
  }, [bookName]);

  // When issueDate changes, update returnDate
  useEffect(() => {
    setReturnDate(addDays(issueDate, 15));
  }, [issueDate]);

  const activeMemberships = memberships.filter(m => m.status === 'Active');

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');

    if (!bookName) { setError('Please select a book/movie.'); return; }
    if (!membershipId) { setError('Please select a membership.'); return; }
    if (!issueDate) { setError('Issue date is required.'); return; }
    if (!returnDate) { setError('Return date is required.'); return; }
    if (issueDate < today()) { setError('Issue date cannot be earlier than today.'); return; }
    if (returnDate > addDays(issueDate, 15)) { setError('Return date cannot exceed Issue Date + 15 days.'); return; }
    if (returnDate < issueDate) { setError('Return date cannot be before issue date.'); return; }

    issueBook({ serialNo: selectedSerial, membershipId, issueDate, returnDate, remarks });
    navigate('/confirmation', { state: { message: `Book "${bookName}" issued successfully to membership ${membershipId}.`, detail: `Serial: ${selectedSerial} | Issue: ${issueDate} | Due: ${returnDate}` } });
  };

  return (
    <div className="page">
      <PageHeader
        title="Book Issue"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔄 Transactions', to: '/transactions' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">📕 Book Issue</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-group">
              <label>Enter Book / Movie Name <span className="req">*</span></label>
              <select
                className="form-control"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                required
              >
                <option value="">-- Select Book / Movie --</option>
                {uniqueNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {selectedSerial && (
              <div className="form-group">
                <label>Serial Number</label>
                <input className="form-control" value={selectedSerial} readOnly />
              </div>
            )}

            <div className="form-group">
              <label>Author / Director</label>
              <input className="form-control" value={author} readOnly placeholder="Auto-populated" />
            </div>

            <div className="form-group">
              <label>Membership ID <span className="req">*</span></label>
              <select
                className="form-control"
                value={membershipId}
                onChange={e => setMembershipId(e.target.value)}
                required
              >
                <option value="">-- Select Membership --</option>
                {activeMemberships.map(m => (
                  <option key={m.membershipId} value={m.membershipId}>
                    {m.membershipId} — {m.firstName} {m.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issue Date <span className="req">*</span></label>
                <input
                  className="form-control"
                  type="date"
                  value={issueDate}
                  min={today()}
                  onChange={e => setIssueDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Return Date <span className="req">*</span></label>
                <input
                  className="form-control"
                  type="date"
                  value={returnDate}
                  min={issueDate}
                  max={addDays(issueDate, 15)}
                  onChange={e => setReturnDate(e.target.value)}
                  required
                />
                <small className="text-muted">Max: Issue Date + 15 days</small>
              </div>
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                className="form-control"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Optional remarks..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/book-issue' } })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">✅ Confirm Issue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
