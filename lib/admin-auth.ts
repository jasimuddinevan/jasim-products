import { getSupabase } from './supabase';

const ADMIN_SESSION_KEY = 'jasim_space_admin_session';

export interface AdminSession {
  email: string;
  isAuthenticated: boolean;
  expiresAt: number;
}

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('password_hash', password)
      .maybeSingle();

    if (error) {
      console.error('Admin login error:', error);
      return false;
    }

    if (!data) {
      console.error('No matching admin user found');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Admin validation exception:', err);
    return false;
  }
}

export function setAdminSession(email: string): void {
  if (typeof window === 'undefined') return;

  const session: AdminSession = {
    email,
    isAuthenticated: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return null;

    const session: AdminSession = JSON.parse(stored);

    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session?.isAuthenticated ?? false;
}
