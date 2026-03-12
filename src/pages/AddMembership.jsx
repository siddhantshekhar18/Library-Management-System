import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

const DURATIONS = [
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
];

export default function AddMembership() {
  const { addMembership } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    aadharNo: '',
    startDate: today,
    duration: '6',
  });
  const [error, setError] = useState('');

  const endDate = form.startDate
    ? addMonths(form.startDate, parseInt(form.duration))
    : '';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return 'First Name is required.';
    if (!form.lastName.trim()) return 'Last Name is required.';
    if (!form.contactNumber.trim()) return 'Contact Number is required.';
    if (!/^\d{10}$/.test(form.contactNumber.replace(/\s/g, ''))) return 'Contact Number must be 10 digits.';
    if (!form.address.trim()) return 'Contact Address is required.';
    if (!form.aadharNo.trim()) return 'Aadhar Card No is required.';
    if (!form.startDate) return 'Start Date is required.';
    if (!form.duration) return 'Please select a membership duration.';
    return null;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const newMembership = addMembership({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      contactNumber: form.contactNumber.trim(),
      address: form.address.trim(),
      aadharNo: form.aadharNo.trim(),
      startDate: form.startDate,
      endDate,
    });
    navigate('/confirmation', {
      state: {
        message: 'Membership added successfully.',
        detail: `Membership ID: ${newMembership.membershipId} | ${newMembership.firstName} ${newMembership.lastName} | Valid till: ${endDate}`,
      }
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Add Membership"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔧 Maintenance', to: '/maintenance' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">➕ Add Membership</div>

        <div className="card" style={{ maxWidth: 680 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="req">*</span></label>
                <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
              </div>
              <div className="form-group">
                <label>Last Name <span className="req">*</span></label>
                <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Number <span className="req">*</span></label>
              <input className="form-control" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} required />
            </div>

            <div className="form-group">
              <label>Contact Address <span className="req">*</span></label>
              <textarea className="form-control" name="address" value={form.address} onChange={handleChange} placeholder="Full address including city, state, PIN" rows={3} required />
            </div>

            <div className="form-group">
              <label>Aadhar Card No <span className="req">*</span></label>
              <input className="form-control" name="aadharNo" value={form.aadharNo} onChange={handleChange} placeholder="XXXX XXXX XXXX" maxLength={14} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date <span className="req">*</span></label>
                <input className="form-control" type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Date (auto-calculated)</label>
                <input className="form-control" type="date" value={endDate} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Membership Duration <span className="req">*</span></label>
              <div className="radio-group">
                {DURATIONS.map(d => (
                  <label key={d.months} className="radio-label">
                    <input
                      type="radio"
                      name="duration"
                      value={String(d.months)}
                      checked={form.duration === String(d.months)}
                      onChange={handleChange}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/add-membership' } })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">✅ Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
