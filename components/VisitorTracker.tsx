'use client';

import { useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const apiUrl = `${supabaseUrl}/functions/v1/track-visit`;

        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: window.location.pathname,
            user_agent: navigator.userAgent,
          }),
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
