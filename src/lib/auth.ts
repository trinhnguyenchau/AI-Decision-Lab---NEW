import { useState, useEffect, useCallback } from 'react';
import { ensureAuthenticatedUser } from './supabase';

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await ensureAuthenticatedUser();
      setUserId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in.');
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { userId, loading, error, retry: initialize };
}
