'use client';

import { createAuthClient } from 'better-auth/react';

const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    // Automatically attach Bearer token stored in localStorage for Capacitor mobile apps
    auth: {
      type: 'Bearer',
      token: () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('fitflow_auth_token') || undefined;
        }
        return undefined;
      },
    },
  },
});

// Helper functions for Capacitor mobile token persistence
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fitflow_auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fitflow_auth_token');
  }
  return null;
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fitflow_auth_token');
  }
}

export const { signIn, signUp, signOut, useSession } = authClient;
