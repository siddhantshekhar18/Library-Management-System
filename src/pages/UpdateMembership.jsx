import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

const EXTENSIONS = [
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
];

export default function UpdateMembership() {
  const { memberships, updateMembership } = useApp();
  const navigate = useNavigate();

  const [membershipNumber, setMembershipNumber] = useState('');
  const [fetched, setFetched] = useState(null);
  const [extension, setExtension] = useState('6');
  const [removeAction, setRemoveAction] = useState(false);
  const [error, setError] = useState('');
  const [lookupError, setLookupError] = useState('');

  const handleLookup = () => {
    setLookupError('');
    const m = memberships.find(m => m.membershipId === membershipNumber.trim());
    if (!m) { setLookupError('Membership not found. Please check the ID.'); setFetched(null); return; }
    setFetched(m);
    setRemoveAction(false);
    setExtension('6');
  };

  const newEndDate = fetched
    ? addMonths(fetched.endDate, parseInt(extension))
    : '';

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');
    if (!fetched) { setError('Please look up a membership first.'); return; }

    if (removeAction) {
      updateMembership(fetched.membershipId, { status: 'Inactive' });
      navigate('/confirmation', {
        state: {
          message: 'Membership cancelled successfully.',
          detail: `Membership ID: ${fetched.membershipId} — ${fetched.firstName} ${fetched.lastName} is now Inactive.`,
        }
      });
    } else {
      updateMembership(fetched.membershipId, { endDate: newEndDate, status: 'Active' });
      navigate('/confirmation', {
        state: {
          message: 'Membership extended successfully.',
          detail: `Membership ID: ${fetched.membershipId} | New end date: ${newEndDate}`,
        }
      });
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Update Membership"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔧 Maintenance', to: '/maintenance' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">✏️ Update Membership</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          {/* Lookup */}
          <div className="form-group">
            <label>Membership Number <span className="req">*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-control"
                value={membershipNumber}
                onChange={e => setMembershipNumber(e.target.value)}
                placeholder="e.g. MEM000001"
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-primary" onClick={handleLookup}>
                🔍 Lookup
              </button>
            </div>
            {lookupError && <div className="alert alert-error" style={{ marginTop: 8 }}><span>⚠️</span> {lookupError}</div>}
          </div>

          {fetched && (
            <form onSubmit={handleConfirm}>
              <div className="alert alert-info">
                <div>
                  <strong>{fetched.firstName} {fetched.lastName}</strong><br />
                  <small>Contact: {fetched.contactNumber} | Status: {fetched.status}</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Start Date</label>
                  <input className="form-control" type="date" value={fetched.startDate} readOnly />
                </div>
                <div className="form-group">
                  <label>Current End Date</label>
                  <input className="form-control" type="date" value={fetched.endDate} readOnly />
                </div>
              </div>

              <div className="form-group">
                <label>Action <span className="req">*</span></label>
                <div className="radio-group" style={{ flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Extend Membership:</label>
                    <div className="radio-group">
                      {EXTENSIONS.map(ext => (
                        <label key={ext.months} className="radio-label">
                          <input
                            type="radio"
                            name="action"
                            value={String(ext.months)}
                            checked={!removeAction && extension === String(ext.months)}
                            onChange={() => { setRemoveAction(false); setExtension(String(ext.months)); }}
                          />
                          {ext.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="action"
                      checked={removeAction}
                      onChange={() => setRemoveAction(true)}
                    />
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>❌ Remove / Cancel Membership</span>
                  </label>
                </div>
              </div>

              {!removeAction && (
                <div className="form-group">
                  <label>New End Date (after extension)</label>
                  <input className="form-control" type="date" value={newEndDate} readOnly />
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/update-membership' } })}>
                  Cancel
                </button>
                <button type="submit" className={`btn ${removeAction ? 'btn-danger' : 'btn-success'}`}>
                  {removeAction ? '❌ Remove Membership' : '✅ Confirm Extension'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
