const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.error || 'Something went wrong')
  }

  return data
}

// Auth
export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => fetchWithAuth('/api/auth/me'),
}

// Matches
export const matchesApi = {
  getAll: (params?: { status?: string; upcoming?: boolean }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return fetchWithAuth(`/api/matches?${query}`)
  },
  getById: (id: string) => fetchWithAuth(`/api/matches/${id}`),
}

// Bets
export const betsApi = {
  place: (matchId: string, pickedTeam: 'team_a' | 'team_b', amount: number) =>
    fetchWithAuth('/api/bets', {
      method: 'POST',
      body: JSON.stringify({ matchId, pickedTeam, amount }),
    }),

  getMyBets: () => fetchWithAuth('/api/bets/my-bets'),
}

// Coins
export const coinsApi = {
  getBalance: () => fetchWithAuth('/api/coins'),
  claimDaily: () => fetchWithAuth('/api/coins/claim-daily', { method: 'POST' }),
}

// Leaderboard
export const leaderboardApi = {
  getAll: (limit?: number) =>
    fetchWithAuth(`/api/leaderboard?${limit ? `limit=${limit}` : ''}`),
}

// Admin
export const adminApi = {
  getMatches: () => fetchWithAuth('/api/admin/matches'),
  createMatch: (data: Record<string, unknown>) =>
    fetchWithAuth('/api/admin/matches', { method: 'POST', body: JSON.stringify(data) }),
  resolveMatch: (id: string, winner: string) =>
    fetchWithAuth(`/api/admin/matches/${id}/resolve`, { method: 'POST', body: JSON.stringify({ winner }) }),
  getUsers: () => fetchWithAuth('/api/admin/users'),
  adjustBalance: (userId: string, amount: number, reason: string) =>
    fetchWithAuth(`/api/admin/users/${userId}/adjust-balance`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    }),
  emailBlast: (subject: string, body: string) =>
    fetchWithAuth('/api/admin/email-blast', {
      method: 'POST',
      body: JSON.stringify({ subject, body }),
    }),
}

export { ApiError }
