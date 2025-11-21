const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface Session {
  id: string;
  user_id?: string;
  subject: string;
  goal_minutes?: number;
  status: 'active' | 'paused' | 'completed';
  start_time: string;
  end_time?: string;
  average_focus: number;
  scores: number[];
  timeline?: { t: number; score: number }[];
  sites?: { domain: string; durationSec: number; avgFocus: number }[];
}

export interface StartSessionRequest {
  subject: string;
  goal_minutes?: number;
  user_id?: string;
}

export interface EndSessionRequest {
  session_id: string;
  average_focus: number;
  scores: number[];
  timeline?: { t: number; score: number }[];
  sites?: { domain: string; durationSec: number; avgFocus: number }[];
  user_id?: string;
}

export async function startSession(data: StartSessionRequest): Promise<Session> {
  try {
    const res = await fetch(`${API_BASE}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`Start session failed: ${res.status}`);
    }
    
    const response = await res.json();
    return response.data?.session || response.session;
  } catch (error) {
    console.error('Failed to start session on backend:', error);
    // Fallback: return a local session object
    throw error;
  }
}

export async function endSession(sessionId: string, data: EndSessionRequest): Promise<Session> {
  try {
    const res = await fetch(`${API_BASE}/api/session/${sessionId}/end`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`End session failed: ${res.status}`);
    }
    
    const response = await res.json();
    return response.data?.session || response.session;
  } catch (error) {
    console.error('Failed to end session on backend:', error);
    throw error;
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const res = await fetch(`${API_BASE}/api/session/${sessionId}`);
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Get session failed: ${res.status}`);
    }
    
    const response = await res.json();
    return response.data?.session || response.session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  try {
    const res = await fetch(`${API_BASE}/api/session/user/${userId}`);
    
    if (!res.ok) {
      throw new Error(`Get user sessions failed: ${res.status}`);
    }
    
    const response = await res.json();
    return response.data?.sessions || [];
  } catch (error) {
    console.error('Failed to get user sessions:', error);
    return [];
  }
}

