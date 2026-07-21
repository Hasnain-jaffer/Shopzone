import jwt from 'jsonwebtoken';
import { getTokenFromRequest } from '../utils/cookies.js';

export const isAuthenticated = (req, res, next) => {
  const token = getTokenFromRequest(req); // Bearer header OR httpOnly cookie

  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    // An expired/invalid token is a client auth problem (401), not a
    // server error (500) — and error.message (e.g. exact JWT internals)
    // shouldn't be echoed back to the client.
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Unauthorized user' });
};
