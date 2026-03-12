import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function PayFine() {
  const { issues, items, returnBook, payFine, calculateFine, getHomeRoute, FINE_PER_DAY } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Can arrive from ReturnBook with state, or directly to pay existing fine
  const prefill = location.state || null;

  // For direct access: list of issues with pending fine or active/overdue
  const openIssues = issues.filter(i => i.status === 'Active' || i.status === 'Overdue' || i.status === 'Fine Pending');

  const [selectedIssueId, setSelectedIssueId] = useState(prefill?.issueId || '');
  const [bookName, setBookName] = useState(prefill?.bookName || '');
  const [author, setAuthor] = useState(prefill?.author || '');
  const [serialNo, setSerialNo] = useState(prefill?.serialNo || '');
  const [issueDate, setIssueDate] = useState(prefill?.issueDate || '');
  const [returnDate, setReturnDate] = useState(prefill?.returnDate || '');
  const [actualReturnDate, setActualReturnDate] = useState(prefill?.actualReturnDate || new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState(prefill?.remarks || '');
  const [finePaid, setFinePaid] = useState(false);
  const [error, setError] = useState('');

  const fine = prefill
    ? prefill.fine
    : selectedIssueId
      ? calculateFine(
          issues.find(i => i.issueId === selectedIssueId)?.returnDate || '',
          actualReturnDate
        )
      : 0;

  // If coming directly (no prefill), populate fields from selected issue
  useEffect(() => {
    if (!prefill && selectedIssueId) {
      const issue = issues.find(i => i.issueId === selectedIssueId);
      if (issue) {
        setIssueDate(issue.issueDate);
        setReturnDate(issue.returnDate);
        setSerialNo(issue.serialNo);
        const item = items.find(it => it.serialNo === issue.serialNo);
        setBookName(item?.name || '');
        setAuthor(item?.author || '');
        if (issue.actualReturnDate) setActualReturnDate(issue.actualReturnDate);
      }
    }
  }, [selectedIssueId, prefill, issues, items]);

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');

    if (fine > 0 && !finePaid) {
      setError('Fine must be paid before confirming. Please check the "Fine Paid" checkbox.');
      return;
    }

    const issueIdToProcess = prefill?.issueId || selectedIssueId;
    if (!issueIdToProcess) { setError('No issue selected.'); return; }

    // If came from return book, call returnBook first
    if (prefill) {
      returnBook(issueIdToProcess, actualReturnDate, remarks);
    }
    if (fine > 0) {
      payFine(issueIdToProcess);
    } else {
      // Just mark as returned
      returnBook(issueIdToProcess, actualReturnDate, remarks);
    }

    navigate('/confirmation', {
      state: {
        message: 'Transaction completed successfully.',
        detail: fine > 0
          ? `Fine of ₹${fine} paid. Book returned.`
          : 'Book returned with no fine.',
      }
    });
  };

  const isReadOnly = !!prefill;

  return (
    <div className="page">
      <PageHeader
        title="Pay Fine"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔄 Transactions', to: '/transactions' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">💰 Pay Fine</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          {!prefill && (
            <div className="form-group">
              <label>Select Issue Record <span className="req">*</span></label>
              <select
                className="form-control"
                value={selectedIssueId}
                onChange={e => setSelectedIssueId(e.target.value)}
              >
                <option value="">-- Select Issue --</option>
                {openIssues.map(issue => {
                  const calcFine = calculateFine(issue.returnDate, actualReturnDate);
                  return (
                    <option key={issue.issueId} value={issue.issueId}>
                      {issue.issueId} | {issue.serialNo} | Due: {issue.returnDate} {calcFine > 0 ? `| Fine: ₹${calcFine}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <form onSubmit={handleConfirm}>
            <div className="form-row">
              <div className="form-group">
                <label>Book / Movie Name</label>
                <input className="form-control" value={bookName} readOnly />
              </div>
              <div className="form-group">
                <label>Author / Director</label>
                <input className="form-control" value={author} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Serial No</label>
                <input className="form-control" value={serialNo} readOnly />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input className="form-control" type="date" value={issueDate} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Return Date</label>
                <input className="form-control" type="date" value={returnDate} readOnly />
              </div>
              <div className="form-group">
                <label>Actual Return Date</label>
                <input className="form-control" type="date" value={actualReturnDate} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Fine Calculated (₹{FINE_PER_DAY}/day overdue)</label>
              <div style={{ padding: '12px 16px', background: fine > 0 ? 'var(--danger-bg)' : 'var(--success-bg)', borderRadius: 'var(--radius)', border: `1.5px solid ${fine > 0 ? 'var(--danger)' : 'var(--success)'}` }}>
                <span className={`fine-amount ${fine === 0 ? 'fine-zero' : ''}`}>
                  ₹{fine}
                </span>
                {fine > 0 && (
                  <span className="text-muted" style={{ marginLeft: 12, fontSize: '0.85rem' }}>
                    ({Math.ceil((new Date(actualReturnDate) - new Date(returnDate)) / (1000*60*60*24))} day(s) overdue × ₹{FINE_PER_DAY})
                  </span>
                )}
              </div>
            </div>

            {fine > 0 && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={finePaid}
                    onChange={e => setFinePaid(e.target.checked)}
                  />
                  Fine Paid
                </label>
              </div>
            )}

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                className="form-control"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Optional remarks..."
                rows={3}
                readOnly={isReadOnly}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(prefill ? '/return-book' : '/cancel', { state: prefill ? undefined : { from: '/pay-fine' } })}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={fine > 0 && !finePaid}
                style={{ opacity: (fine > 0 && !finePaid) ? 0.5 : 1 }}
              >
                ✅ Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
