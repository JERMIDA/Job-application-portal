import { env } from './env.js';

export const jwtConfig = {
  secret: env.JWT_SECRET, // Ensure this is correctly set
  expiresIn: env.JWT_EXPIRE || '30d',
  cookieName: 'debo_jwt',
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};