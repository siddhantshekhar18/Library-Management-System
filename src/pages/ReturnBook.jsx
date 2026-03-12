import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function ReturnBook() {
  const { items, issues, getHomeRoute, calculateFine } = useApp();
  const navigate = useNavigate();

  // Find issued items
  const issuedItems = items.filter(i => i.status === 'Issued');
  const uniqueIssuedNames = [...new Set(issuedItems.map(i => i.name))].sort();

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [currentIssue, setCurrentIssue] = useState(null);
  const [error, setError] = useState('');

  // Available serials for selected book name
  const availableSerials = issuedItems.filter(i => i.name === bookName).map(i => i.serialNo);

  useEffect(() => {
    if (bookName) {
      const match = issuedItems.find(i => i.name === bookName);
      if (match) setAuthor(match.author);
      else setAuthor('');
      setSerialNo('');
      setIssueDate('');
      setReturnDate('');
      setCurrentIssue(null);
    }
  }, [bookName]);

  useEffect(() => {
    if (serialNo) {
      const issue = issues.find(i => i.serialNo === serialNo && (i.status === 'Active' || i.status === 'Overdue'));
      if (issue) {
        setIssueDate(issue.issueDate);
        setReturnDate(issue.returnDate);
        setCurrentIssue(issue);
      }
    } else {
      setIssueDate('');
      setReturnDate('');
      setCurrentIssue(null);
    }
  }, [serialNo]);

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');
    if (!bookName) { setError('Please select a book/movie.'); return; }
    if (!serialNo) { setError('Please select a serial number.'); return; }
    if (!actualReturnDate) { setError('Please enter actual return date.'); return; }
    if (!currentIssue) { setError('Could not find active issue record for this item.'); return; }

    const fine = calculateFine(currentIssue.returnDate, actualReturnDate);

    navigate('/pay-fine', {
      state: {
        issueId: currentIssue.issueId,
        bookName,
        author,
        serialNo,
        issueDate,
        returnDate,
        actualReturnDate,
        fine,
        remarks,
      }
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Return Book"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔄 Transactions', to: '/transactions' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">📗 Return Book</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-group">
              <label>Book / Movie Name <span className="req">*</span></label>
              <select
                className="form-control"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                required
              >
                <option value="">-- Select Book / Movie --</option>
                {uniqueIssuedNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Author / Director</label>
              <textarea className="form-control" value={author} readOnly rows={1} placeholder="Auto-populated" />
            </div>

            <div className="form-group">
              <label>Serial No <span className="req">*</span></label>
              <select
                className="form-control"
                value={serialNo}
                onChange={e => setSerialNo(e.target.value)}
                required
                disabled={!bookName}
              >
                <option value="">-- Select Serial No --</option>
                {availableSerials.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issue Date</label>
                <input className="form-control" type="text" value={issueDate} readOnly placeholder="Auto-populated" />
              </div>
              <div className="form-group">
                <label>Expected Return Date</label>
                <input className="form-control" type="date" value={returnDate} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Actual Return Date <span className="req">*</span></label>
              <input
                className="form-control"
                type="date"
                value={actualReturnDate}
                onChange={e => setActualReturnDate(e.target.value)}
                required
              />
              {currentIssue && actualReturnDate > currentIssue.returnDate && (
                <div className="alert alert-warning" style={{ marginTop: 8 }}>
                  ⚠️ This return is overdue. A fine will be calculated.
                </div>
              )}
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
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/return-book' } })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">✅ Confirm Return</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
