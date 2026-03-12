import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

const CODE_TABLE = [
  { from: 'SC(B/M)000001', to: 'SC(B/M)000004', category: 'Science' },
  { from: 'EC(B/M)000001', to: 'EC(B/M)000004', category: 'Economics' },
  { from: 'FC(B/M)000001', to: 'FC(B/M)000004', category: 'Fiction' },
  { from: 'CH(B/M)000001', to: 'CH(B/M)000004', category: 'Children' },
  { from: 'PD(B/M)000001', to: 'PD(B/M)000004', category: 'Personal Development' },
];

export default function AdminHome() {
  return (
    <div className="page">
      <PageHeader
        title="Library Management System"
        links={[{ label: '📊 Chart', to: '/chart' }]}
      />
      <div className="content">
        <div className="page-title">🏠 Admin Home Page</div>

        <div className="home-menu">
          <Link to="/maintenance" className="menu-card">
            <div className="menu-icon">🔧</div>
            <h3>Maintenance</h3>
            <p>Manage books, members & users</p>
          </Link>
          <Link to="/reports" className="menu-card">
            <div className="menu-icon">📑</div>
            <h3>Reports</h3>
            <p>View all system reports</p>
          </Link>
          <Link to="/transactions" className="menu-card">
            <div className="menu-icon">🔄</div>
            <h3>Transactions</h3>
            <p>Issue, return & manage books</p>
          </Link>
        </div>

        <div className="card code-table">
          <div className="card-title">📋 Product Code Reference</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Code No From</th>
                  <th>Code No To</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {CODE_TABLE.map(row => (
                  <tr key={row.category}>
                    <td><code>{row.from}</code></td>
                    <td><code>{row.to}</code></td>
                    <td>{row.category}</td>
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
