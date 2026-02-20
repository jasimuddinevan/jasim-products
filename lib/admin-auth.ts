const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
    const res = await fetch(`${supabaseUrl}/functions/v1/manage-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.success === true;
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
