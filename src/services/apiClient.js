const API_TIMEOUT_MS = 3000;

async function fetchWithTimeout(url, options = {}, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function pingBackend() {
  try {
    const res = await fetchWithTimeout('/api/health');
    if (!res.ok) return { connected: false, message: 'Backend health endpoint returned an error.' };
    const payload = await parseJsonSafe(res);
    return { connected: true, payload };
  } catch {
    return { connected: false, message: 'Backend server is unreachable.' };
  }
}

export async function loginWithBackend(userId, password) {
  try {
    const res = await fetchWithTimeout('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    });
    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        backendReachable: true,
        message: payload?.message || 'Invalid credentials',
      };
    }

    return {
      success: true,
      backendReachable: true,
      user: payload?.user || null,
    };
  } catch {
    return {
      success: false,
      backendReachable: false,
      message: 'Backend server is unreachable.',
    };
  }
}
