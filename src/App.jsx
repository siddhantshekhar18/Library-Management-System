import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import AdminHome from './pages/AdminHome.jsx';
import UserHome from './pages/UserHome.jsx';
import Transactions from './pages/Transactions.jsx';
import BookAvailable from './pages/BookAvailable.jsx';
import SearchResults from './pages/SearchResults.jsx';
import BookIssue from './pages/BookIssue.jsx';
import ReturnBook from './pages/ReturnBook.jsx';
import PayFine from './pages/PayFine.jsx';
import Reports from './pages/Reports.jsx';
import MasterListBooks from './pages/MasterListBooks.jsx';
import MasterListMovies from './pages/MasterListMovies.jsx';
import MasterListMemberships from './pages/MasterListMemberships.jsx';
import ActiveIssues from './pages/ActiveIssues.jsx';
import OverdueReturns from './pages/OverdueReturns.jsx';
import IssueRequests from './pages/IssueRequests.jsx';
import Maintenance from './pages/Maintenance.jsx';
import AddMembership from './pages/AddMembership.jsx';
import UpdateMembership from './pages/UpdateMembership.jsx';
import AddBookMovie from './pages/AddBookMovie.jsx';
import UpdateBookMovie from './pages/UpdateBookMovie.jsx';
import UserManagement from './pages/UserManagement.jsx';
import Cancel from './pages/Cancel.jsx';
import Confirmation from './pages/Confirmation.jsx';
import Logout from './pages/Logout.jsx';
import Chart from './pages/Chart.jsx';

function RequireAuth({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/user-home" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/cancel" element={<RequireAuth><Cancel /></RequireAuth>} />
      <Route path="/confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />
      <Route path="/chart" element={<RequireAuth><Chart /></RequireAuth>} />

      <Route path="/admin-home" element={<RequireAdmin><AdminHome /></RequireAdmin>} />
      <Route path="/user-home" element={<RequireAuth><UserHome /></RequireAuth>} />

      <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
      <Route path="/book-available" element={<RequireAuth><BookAvailable /></RequireAuth>} />
      <Route path="/search-results" element={<RequireAuth><SearchResults /></RequireAuth>} />
      <Route path="/book-issue" element={<RequireAuth><BookIssue /></RequireAuth>} />
      <Route path="/return-book" element={<RequireAuth><ReturnBook /></RequireAuth>} />
      <Route path="/pay-fine" element={<RequireAuth><PayFine /></RequireAuth>} />

      <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
      <Route path="/master-books" element={<RequireAuth><MasterListBooks /></RequireAuth>} />
      <Route path="/master-movies" element={<RequireAuth><MasterListMovies /></RequireAuth>} />
      <Route path="/master-memberships" element={<RequireAuth><MasterListMemberships /></RequireAuth>} />
      <Route path="/active-issues" element={<RequireAuth><ActiveIssues /></RequireAuth>} />
      <Route path="/overdue-returns" element={<RequireAuth><OverdueReturns /></RequireAuth>} />
      <Route path="/issue-requests" element={<RequireAuth><IssueRequests /></RequireAuth>} />

      <Route path="/maintenance" element={<RequireAdmin><Maintenance /></RequireAdmin>} />
      <Route path="/add-membership" element={<RequireAdmin><AddMembership /></RequireAdmin>} />
      <Route path="/update-membership" element={<RequireAdmin><UpdateMembership /></RequireAdmin>} />
      <Route path="/add-book-movie" element={<RequireAdmin><AddBookMovie /></RequireAdmin>} />
      <Route path="/update-book-movie" element={<RequireAdmin><UpdateBookMovie /></RequireAdmin>} />
      <Route path="/user-management" element={<RequireAdmin><UserManagement /></RequireAdmin>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
