import express from 'express';
import cors from 'cors';
import { users } from './data.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'library-management-api',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body || {};
  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'User ID and password are required.' });
  }

  const user = users.find(u => u.id === userId && u.password === password && u.status === 'active');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Library backend API running on http://localhost:${PORT}`);
});
