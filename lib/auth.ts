import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { pool } from './db';

const secret =
  process.env.BETTER_AUTH_SECRET ||
  'fitflow-production-ultra-secret-key-2026-auth';
const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const auth = betterAuth({
  database: pool,
  secret,
  baseURL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'capacitor://localhost',
    'http://localhost',
    'https://localhost',
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [
    // Bearer token plugin enables mobile Capacitor & WebView authentication
    // so sessions persist seamlessly without being dropped on app restart.
    bearer(),
  ],
});
