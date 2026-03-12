import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function UserManagement() {
  const { users, addUser, updateUser } = useApp();
  const navigate = useNavigate();

  const [userType, setUserType] = useState('new');
  const [name, setName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [newCreds, setNewCreds] = useState(null);

  const existingUsers = users.filter(u => u.id !== 'adm' && u.id !== 'user');

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required.'); return; }

    if (userType === 'new') {
      const created = addUser({
        name: name.trim(),
        role: isAdmin ? 'admin' : 'user',
        status: isActive ? 'active' : 'inactive',
        password: Math.random().toString(36).slice(2, 8),
      });
      setNewCreds({ id: created.id, password: created.password, name: created.name });
    } else {
      if (!selectedUserId) { setError('Please select an existing user.'); return; }
      updateUser(selectedUserId, {
        name: name.trim(),
        role: isAdmin ? 'admin' : 'user',
        status: isActive ? 'active' : 'inactive',
      });
      navigate('/confirmation', {
        state: {
          message: 'User updated successfully.',
          detail: `User ID: ${selectedUserId} | Name: ${name} | Role: ${isAdmin ? 'Admin' : 'User'} | Status: ${isActive ? 'Active' : 'Inactive'}`,
        }
      });
    }
  };

  const handleSelectUser = (e) => {
    const uid = e.target.value;
    setSelectedUserId(uid);
    if (uid) {
      const u = users.find(u => u.id === uid);
      if (u) {
        setName(u.name);
        setIsActive(u.status === 'active');
        setIsAdmin(u.role === 'admin');
      }
    }
  };

  if (newCreds) {
    return (
      <div className="page">
        <PageHeader title="User Management" links={[{ label: '🔧 Maintenance', to: '/maintenance' }, { label: '🏠 Home', to: '/admin-home' }]} />
        <div className="content">
          <div className="card" style={{ maxWidth: 500, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ color: 'var(--success)', marginBottom: 12 }}>User Created Successfully!</h2>
            <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: 20 }}>
              <div><strong>User ID:</strong> {newCreds.id}</div>
              <div><strong>Name:</strong> {newCreds.name}</div>
              <div><strong>Password:</strong> <code>{newCreds.password}</code></div>
              <div style={{ marginTop: 8, color: 'var(--warning)', fontSize: '0.85rem' }}>⚠️ Please save these credentials. The password cannot be retrieved later.</div>
            </div>
            <div className="form-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => { setNewCreds(null); setName(''); setSelectedUserId(''); }}>Add Another User</button>
              <button className="btn btn-secondary" onClick={() => navigate('/maintenance')}>Back to Maintenance</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title="User Management"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔧 Maintenance', to: '/maintenance' },
          { label: '🏠 Home', to: '/admin-home' },
        ]}
      />
      <div className="content">
        <div className="page-title">👤 User Management</div>

        <div className="card" style={{ maxWidth: 580 }}>
          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleConfirm}>
            <div className="form-group">
              <label>User Type <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" checked={userType === 'new'} onChange={() => { setUserType('new'); setName(''); setSelectedUserId(''); setIsActive(true); setIsAdmin(false); }} />
                  ➕ New User
                </label>
                <label className="radio-label">
                  <input type="radio" checked={userType === 'existing'} onChange={() => setUserType('existing')} />
                  ✏️ Existing User
                </label>
              </div>
            </div>

            {userType === 'existing' && (
              <div className="form-group">
                <label>Select User</label>
                <select className="form-control" value={selectedUserId} onChange={handleSelectUser}>
                  <option value="">-- Select User --</option>
                  {users.filter(u => u.id !== 'adm').map(u => (
                    <option key={u.id} value={u.id}>{u.id} — {u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Name <span className="req">*</span></label>
              <input
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <label className="checkbox-label">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                Active
              </label>
            </div>

            <div className="form-group">
              <label>Role</label>
              <label className="checkbox-label">
                <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
                Admin (grants maintenance access)
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel', { state: { from: '/user-management' } })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {userType === 'new' ? '✅ Create User' : '✅ Update User'}
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="card" style={{ marginTop: 24, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <strong>All System Users ({users.length})</strong>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><code>{u.id}</code></td>
                    <td>{u.name}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'issued' : 'available'}`}>{u.role}</span></td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
