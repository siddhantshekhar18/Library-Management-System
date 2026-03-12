import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function BookAvailable() {
  const { items, getHomeRoute } = useApp();
  const navigate = useNavigate();
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  // Unique names and authors for dropdowns
  const uniqueNames = [...new Set(items.map(i => i.name))].sort();
  const uniqueAuthors = [...new Set(items.map(i => i.author))].sort();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!bookName.trim() && !author.trim()) {
      setError('Please enter book name or author to search');
      return;
    }
    setError('');
    const results = items.filter(item => {
      const matchName = !bookName.trim() || item.name.toLowerCase().includes(bookName.toLowerCase());
      const matchAuthor = !author.trim() || item.author.toLowerCase().includes(author.toLowerCase());
      return matchName && matchAuthor;
    });
    navigate('/search-results', { state: { results, searchName: bookName, searchAuthor: author } });
  };

  const handleCancel = () => navigate('/cancel', { state: { from: '/book-available' } });

  return (
    <div className="page">
      <PageHeader
        title="Book Availability"
        links={[
          { label: '📊 Chart', to: '/chart' },
          { label: '🔄 Transactions', to: '/transactions' },
          { label: '🏠 Home', to: getHomeRoute() },
        ]}
      />
      <div className="content">
        <div className="page-title">🔍 Book Availability</div>

        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-title">Search Criteria</div>

          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="bookName">Enter Book / Movie Name</label>
              <select
                id="bookName"
                className="form-control"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
              >
                <option value="">-- Select or type below --</option>
                {uniqueNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <input
                className="form-control"
                style={{ marginTop: 8 }}
                type="text"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                placeholder="Or type book/movie name here..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Enter Author / Director</label>
              <select
                id="author"
                className="form-control"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              >
                <option value="">-- Select or type below --</option>
                {uniqueAuthors.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                className="form-control"
                style={{ marginTop: 8 }}
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Or type author/director name here..."
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn btn-primary">🔍 Search</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
