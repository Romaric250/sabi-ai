import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

interface SessionData {
  user: User | null;
  session: Session | null;
}

export function useTempSession() {
  const [data, setData] = useState<SessionData>({ user: null, session: null });
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/temp-auth/session');
      const sessionData = await response.json();
      setData(sessionData);
    } catch (error) {
      console.error('Failed to check session:', error);
      setData({ user: null, session: null });
    } finally {
      setIsPending(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/temp-auth/session', { method: 'DELETE' });
      setData({ user: null, session: null });
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return {
    data,
    isPending,
    signOut,
  };
}
