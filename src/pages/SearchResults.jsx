import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function SearchResults() {
  const { getHomeRoute } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { results = [], searchName = '', searchAuthor = '' } = location.state || {};
  const [selectedSerial, setSelectedSerial] = useState('');

  const handleIssue = () => {
    if (!selectedSerial) return;
    const book = results.find(r => r.serialNo === selectedSerial);
    navigate('/book-issue', { state: { selectedBook: book } });
  };

  return (
    <div className="page">
      <PageHeader
        title="Search Results"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔄 Transactions', to: '/transactions' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">🔍 Search Results</div>

        <div className="card" style={{ marginBottom: 12 }}>
          <span className="text-muted">
            Search criteria: {searchName && <strong>Name: "{searchName}"</strong>}
            {searchName && searchAuthor && ' | '}
            {searchAuthor && <strong>Author: "{searchAuthor}"</strong>}
            {' — '}
            <strong>{results.length}</strong> result(s) found.
          </span>
        </div>

        {results.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No books or movies found matching your search.</p>
              <button className="btn btn-secondary mt-16" onClick={() => navigate('/book-available')}>
                ← Back to Search
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Book / Movie Name</th>
                    <th>Author / Director</th>
                    <th>Serial Number</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th className="td-center">Available</th>
                    <th className="td-center">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(item => (
                    <tr key={item.serialNo}>
                      <td>{item.name}</td>
                      <td>{item.author}</td>
                      <td><code>{item.serialNo}</code></td>
                      <td>{item.type}</td>
                      <td>{item.category}</td>
                      <td className="td-center">
                        <span className={`badge badge-${item.status === 'Available' ? 'available' : 'issued'}`}>
                          {item.status === 'Available' ? 'Y' : 'N'}
                        </span>
                      </td>
                      <td className="td-center">
                        <input
                          type="radio"
                          name="selectedBook"
                          value={item.serialNo}
                          disabled={item.status !== 'Available'}
                          checked={selectedSerial === item.serialNo}
                          onChange={() => setSelectedSerial(item.serialNo)}
                          style={{ width: 16, height: 16, cursor: item.status === 'Available' ? 'pointer' : 'not-allowed', accentColor: 'var(--primary)' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => navigate('/book-available')}>
                ← Back to Search
              </button>
              <button
                className="btn btn-primary"
                onClick={handleIssue}
                disabled={!selectedSerial}
                style={{ opacity: selectedSerial ? 1 : 0.5 }}
              >
                📕 Issue Selected Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
