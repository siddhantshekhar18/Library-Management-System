import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CATEGORIES } from '../data/initialData.js';

export default function AddBookMovie() {
  const { addItem } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    type: 'Book',
    name: '',
    author: '',
    category: 'Science',
    procurementDate: today,
    cost: '',
    quantity: '1',
  });
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPreview(null);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Book/Movie name is required.';
    if (!form.author.trim()) return `${form.type === 'Book' ? 'Author' : 'Director'} name is required.`;
    if (!form.category) return 'Category is required.';
    if (!form.procurementDate) return 'Procurement date is required.';
    if (!form.cost || isNaN(parseFloat(form.cost)) || parseFloat(form.cost) < 0) return 'Valid cost is required.';
    const qty = parseInt(form.quantity);
    if (!qty || qty < 1 || qty > 100) return 'Quantity must be a positive integer (max 100).';
    return null;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const newItems = addItem(form);
    navigate('/confirmation', {
      state: {
        message: `${form.type}(s) added successfully.`,
        detail: `Added ${newItems.length} copy/copies of "${form.name}". Serial numbers: ${newItems.map(i => i.serialNo).join(', ')}`,
      }
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Add Book / Movie"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔧 Maintenance', to: '/maintenance' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">➕ Add Book / Movie</div>

        <div className="card" style={{ maxWidth: 640 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-group">
              <label>Type <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="type" value="Book" checked={form.type === 'Book'} onChange={handleChange} />
                  📗 Book
                </label>
                <label className="radio-label">
                  <input type="radio" name="type" value="Movie" checked={form.type === 'Movie'} onChange={handleChange} />
                  🎬 Movie
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>{form.type} Name <span className="req">*</span></label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder={`Enter ${form.type.toLowerCase()} name`} required />
            </div>

            <div className="form-group">
              <label>{form.type === 'Book' ? 'Author' : 'Director'} Name <span className="req">*</span></label>
              <input className="form-control" name="author" value={form.author} onChange={handleChange} placeholder={`Enter ${form.type === 'Book' ? 'author' : 'director'} name`} required />
            </div>

            <div className="form-group">
              <label>Category <span className="req">*</span></label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Procurement <span className="req">*</span></label>
                <input className="form-control" type="date" name="procurementDate" value={form.procurementDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Cost (₹) <span className="req">*</span></label>
                <input className="form-control" type="number" name="cost" value={form.cost} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required />
              </div>
            </div>

            <div className="form-group">
              <label>Quantity / Copies <span className="req">*</span></label>
              <input className="form-control" type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" max="100" required />
              <small className="text-muted">Each copy gets a unique serial number.</small>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/add-book-movie' } })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">✅ Confirm Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
