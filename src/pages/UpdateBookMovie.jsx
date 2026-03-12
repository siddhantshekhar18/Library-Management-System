import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

const STATUSES = ['Available', 'Issued', 'Lost', 'Damaged'];

export default function UpdateBookMovie() {
  const { items, updateItem } = useApp();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState('Book');
  const [serialNo, setSerialNo] = useState('');
  const [fetched, setFetched] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    status: '',
    cost: '',
    procurementDate: '',
  });

  const handleLookup = () => {
    setLookupError('');
    const item = items.find(i => i.serialNo === serialNo.trim() && i.type === typeFilter);
    if (!item) {
      setLookupError(`No ${typeFilter.toLowerCase()} found with serial number "${serialNo}".`);
      setFetched(null);
      return;
    }
    setFetched(item);
    setForm({ status: item.status, cost: String(item.cost), procurementDate: item.procurementDate });
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');
    if (!fetched) { setError('Please look up an item first.'); return; }
    if (!form.status) { setError('Status is required.'); return; }
    if (!form.cost || isNaN(parseFloat(form.cost))) { setError('Valid cost is required.'); return; }
    if (!form.procurementDate) { setError('Date is required.'); return; }

    updateItem(fetched.serialNo, {
      status: form.status,
      cost: parseFloat(form.cost),
      procurementDate: form.procurementDate,
    });
    navigate('/confirmation', {
      state: {
        message: `${fetched.type} updated successfully.`,
        detail: `Serial: ${fetched.serialNo} | "${fetched.name}" | Status: ${form.status}`,
      }
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Update Book / Movie"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔧 Maintenance', to: '/maintenance' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">✏️ Update Book / Movie</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="typeFilter" value="Book" checked={typeFilter === 'Book'} onChange={() => { setTypeFilter('Book'); setFetched(null); setSerialNo(''); }} />
                📗 Book
              </label>
              <label className="radio-label">
                <input type="radio" name="typeFilter" value="Movie" checked={typeFilter === 'Movie'} onChange={() => { setTypeFilter('Movie'); setFetched(null); setSerialNo(''); }} />
                🎬 Movie
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Serial No <span className="req">*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="form-control" value={serialNo} onChange={e => setSerialNo(e.target.value)} style={{ flex: 1 }}>
                <option value="">-- Select Serial No --</option>
                {items.filter(i => i.type === typeFilter).map(i => (
                  <option key={i.serialNo} value={i.serialNo}>{i.serialNo} — {i.name}</option>
                ))}
              </select>
              <button type="button" className="btn btn-primary" onClick={handleLookup}>🔍 Load</button>
            </div>
            {lookupError && <div className="alert alert-error" style={{ marginTop: 8 }}><span>⚠️</span> {lookupError}</div>}
          </div>

          {fetched && (
            <form onSubmit={handleConfirm}>
              <div className="alert alert-info">
                <div>
                  <strong>{fetched.name}</strong> <span className="text-muted">by {fetched.author}</span><br />
                  <small>Category: {fetched.category} | Serial: {fetched.serialNo}</small>
                </div>
              </div>

              <div className="form-group">
                <label>Status <span className="req">*</span></label>
                <select className="form-control" name="status" value={form.status} onChange={handleChange} required>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cost (₹) <span className="req">*</span></label>
                  <input className="form-control" type="number" name="cost" value={form.cost} onChange={handleChange} min="0" step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Procurement Date <span className="req">*</span></label>
                  <input className="form-control" type="date" name="procurementDate" value={form.procurementDate} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/update-book-movie' } })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">✅ Confirm Update</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
