import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialUsers,
  initialItems,
  initialMemberships,
  initialIssues,
  initialIssueRequests,
  CATEGORY_CODES,
  FINE_PER_DAY,
} from '../data/initialData.js';
import { loginWithBackend, pingBackend } from '../services/apiClient.js';

const AppContext = createContext(null);

function loadOrDefault(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function extractNumericSuffix(value, prefixLength) {
  const parsed = parseInt(value.slice(prefixLength), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function getNextPaddedNumber(values, pad = 6) {
  const max = values.length > 0 ? Math.max(...values) : 0;
  return String(max + 1).padStart(pad, '0');
}

function nextSerialForPrefix(sourceItems, prefix) {
  const nums = sourceItems
    .filter(item => item.serialNo.startsWith(prefix))
    .map(item => extractNumericSuffix(item.serialNo, prefix.length))
    .filter(n => n !== null);
  return `${prefix}${getNextPaddedNumber(nums, 6)}`;
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadOrDefault('lms_currentUser', null));
  const [users, setUsers] = useState(() => loadOrDefault('lms_users', initialUsers));
  const [items, setItems] = useState(() => loadOrDefault('lms_items', initialItems));
  const [memberships, setMemberships] = useState(() => loadOrDefault('lms_memberships', initialMemberships));
  const [issues, setIssues] = useState(() => loadOrDefault('lms_issues', initialIssues));
  const [issueRequests, setIssueRequests] = useState(() => loadOrDefault('lms_issueRequests', initialIssueRequests));
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendMessage, setBackendMessage] = useState('Checking backend connection...');

  useEffect(() => {
    save('lms_currentUser', currentUser);
    save('lms_users', users);
    save('lms_items', items);
    save('lms_memberships', memberships);
    save('lms_issues', issues);
    save('lms_issueRequests', issueRequests);
  }, [currentUser, users, items, memberships, issues, issueRequests]);

  const checkBackendConnection = useCallback(async () => {
    const result = await pingBackend();
    if (result.connected) {
      setBackendConnected(true);
      setBackendMessage('Backend connected');
    } else {
      setBackendConnected(false);
      setBackendMessage('Backend unavailable, using local fallback data');
    }
    return result;
  }, []);

  useEffect(() => {
    checkBackendConnection();
  }, [checkBackendConnection]);

  const login = async (userId, password) => {
    const backendResult = await loginWithBackend(userId, password);

    if (backendResult.backendReachable) {
      setBackendConnected(true);
      setBackendMessage('Backend connected');
      if (backendResult.success && backendResult.user) {
        setCurrentUser(backendResult.user);
        return { success: true, user: backendResult.user, source: 'backend' };
      }
      setCurrentUser(null);
      return {
        success: false,
        message: backendResult.message || 'Invalid credentials',
        source: 'backend',
      };
    }

    setBackendConnected(false);
    setBackendMessage('Backend unavailable, using local fallback data');
    const user = users.find(u => u.id === userId && u.password === password && u.status === 'active');
    if (user) {
      setCurrentUser(user);
      return { success: true, user, source: 'local' };
    }

    setCurrentUser(null);
    return { success: false, message: 'Invalid credentials', source: 'local' };
  };

  const logout = () => setCurrentUser(null);

  const getHomeRoute = () => (currentUser?.role === 'admin' ? '/admin-home' : '/user-home');

  const generateSerialNo = (category, type) => {
    const code = CATEGORY_CODES[category];
    const typeCode = type === 'Book' ? 'B' : 'M';
    const prefix = `${code}${typeCode}`;
    return nextSerialForPrefix(items, prefix);
  };

  const generateMembershipId = () => {
    const nums = memberships
      .map(m => extractNumericSuffix(m.membershipId, 3))
      .filter(n => n !== null);
    return `MEM${getNextPaddedNumber(nums, 6)}`;
  };

  const generateIssueId = () => {
    const nums = issues
      .map(i => extractNumericSuffix(i.issueId, 3))
      .filter(n => n !== null);
    return `ISS${getNextPaddedNumber(nums, 6)}`;
  };

  const generateRequestId = () => {
    const nums = issueRequests
      .map(r => extractNumericSuffix(r.requestId, 3))
      .filter(n => n !== null);
    return `REQ${getNextPaddedNumber(nums, 6)}`;
  };

  const generateUserId = () => {
    const nums = users
      .filter(u => u.id.startsWith('usr'))
      .map(u => extractNumericSuffix(u.id, 3))
      .filter(n => n !== null);
    return `usr${getNextPaddedNumber(nums, 3)}`;
  };

  const addItem = (itemData) => {
    const { category, type, name, author, procurementDate, cost, quantity } = itemData;
    const qty = parseInt(quantity, 10) || 1;
    const newItems = [];

    for (let i = 0; i < qty; i += 1) {
      const code = CATEGORY_CODES[category];
      const typeCode = type === 'Book' ? 'B' : 'M';
      const prefix = `${code}${typeCode}`;
      const serialNo = nextSerialForPrefix([...items, ...newItems], prefix);

      newItems.push({
        serialNo,
        name,
        author,
        category,
        type,
        status: 'Available',
        cost: parseFloat(cost) || 0,
        procurementDate,
      });
    }

    setItems(prev => [...prev, ...newItems]);
    return newItems;
  };

  const updateItem = (serialNo, updates) => {
    setItems(prev => prev.map(item => (item.serialNo === serialNo ? { ...item, ...updates } : item)));
  };

  const addMembership = data => {
    const membershipId = generateMembershipId();
    const newMembership = { membershipId, ...data, fineAmount: 0, status: 'Active' };
    setMemberships(prev => [...prev, newMembership]);
    return newMembership;
  };

  const updateMembership = (membershipId, updates) => {
    setMemberships(prev => prev.map(m => (m.membershipId === membershipId ? { ...m, ...updates } : m)));
  };

  const issueBook = issueData => {
    const issueId = generateIssueId();
    const newIssue = {
      issueId,
      ...issueData,
      actualReturnDate: null,
      finePaid: false,
      status: 'Active',
    };
    setIssues(prev => [...prev, newIssue]);
    updateItem(issueData.serialNo, { status: 'Issued' });
    return newIssue;
  };

  const calculateFine = (returnDate, actualReturnDate) => {
    if (!actualReturnDate) return 0;
    const due = new Date(returnDate);
    const actual = new Date(actualReturnDate);
    if (actual <= due) return 0;
    const diffDays = Math.ceil((actual - due) / (1000 * 60 * 60 * 24));
    return diffDays * FINE_PER_DAY;
  };

  const returnBook = (issueId, actualReturnDate, remarks) => {
    const issue = issues.find(i => i.issueId === issueId);
    if (!issue) return 0;

    const fine = calculateFine(issue.returnDate, actualReturnDate);
    setIssues(prev =>
      prev.map(i =>
        i.issueId === issueId
          ? {
              ...i,
              actualReturnDate,
              remarks: remarks || i.remarks,
              status: fine > 0 ? 'Fine Pending' : 'Returned',
            }
          : i
      )
    );

    if (fine === 0) {
      updateItem(issue.serialNo, { status: 'Available' });
    }

    return fine;
  };

  const payFine = issueId => {
    const issue = issues.find(i => i.issueId === issueId);
    if (!issue) return;

    setIssues(prev =>
      prev.map(i => (i.issueId === issueId ? { ...i, finePaid: true, status: 'Returned' } : i))
    );
    updateItem(issue.serialNo, { status: 'Available' });
  };

  const addUser = userData => {
    const id = generateUserId();
    const password = Math.random().toString(36).slice(2, 8);
    const newUser = { id, password, ...userData };
    setUsers(prev => [...prev, newUser]);
    return { ...newUser, password };
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => (user.id === userId ? { ...user, ...updates } : user)));
  };

  const addIssueRequest = data => {
    const requestId = generateRequestId();
    const newRequest = { requestId, ...data, status: 'Pending', fulfilledDate: null };
    setIssueRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const fulfillRequest = requestId => {
    setIssueRequests(prev =>
      prev.map(req =>
        req.requestId === requestId
          ? { ...req, status: 'Fulfilled', fulfilledDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
  };

  const searchItems = (name, author, type) =>
    items.filter(item => {
      const matchType = !type || item.type === type;
      const matchName = !name || item.name.toLowerCase().includes(name.toLowerCase());
      const matchAuthor = !author || item.author.toLowerCase().includes(author.toLowerCase());
      return matchType && (name || author) && matchName && matchAuthor;
    });

  const resetData = () => {
    setUsers(initialUsers);
    setItems(initialItems);
    setMemberships(initialMemberships);
    setIssues(initialIssues);
    setIssueRequests(initialIssueRequests);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    users,
    items,
    memberships,
    issues,
    issueRequests,
    backendConnected,
    backendMessage,
    checkBackendConnection,
    login,
    logout,
    getHomeRoute,
    generateSerialNo,
    generateMembershipId,
    addItem,
    updateItem,
    addMembership,
    updateMembership,
    issueBook,
    returnBook,
    calculateFine,
    payFine,
    addUser,
    updateUser,
    addIssueRequest,
    fulfillRequest,
    searchItems,
    resetData,
    FINE_PER_DAY,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
