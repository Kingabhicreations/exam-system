// server/src/middleware/auth.js

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// =========================
// REQUIRE AUTH
// =========================

export async function requireAuth(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    const token =
      authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        'secretkey'
    );

    const user =
      await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(
      'AUTH ERROR:',
      error
    );

    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}

// =========================
// REQUIRE ROLE
// =========================

export function requireRole(role) {
  return (req, res, next) => {
    try {
      if (
        !req.user ||
        req.user.role !== role
      ) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }

      next();

    } catch (error) {
      console.log(
        'ROLE ERROR:',
        error
      );

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  };
}