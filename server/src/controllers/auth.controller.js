// server/src/controllers/auth.controller.js

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { body, validationResult } from 'express-validator';

import { User } from '../models/User.js';

// =========================
// VALIDATION
// =========================

export const validateRegister = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 100 }),

  body('email')
    .isEmail(),

  body('password')
    .isLength({ min: 6 }),

  body('role')
    .optional()
    .isIn(['student', 'admin']),
];

// =========================
// HELPERS
// =========================

function generateOtp() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

function signToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secretkey',
    {
      expiresIn: '7d',
    }
  );
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    avatarUrl: user.avatarUrl,
  };
}

// =========================
// REGISTER
// =========================

export async function register(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Check Existing User
    const exists = await User.findOne({
      email,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash Password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();

    // Create User
    const user = await User.create({
      name,
      email,

      password: hashedPassword,

      role:
        role === 'admin'
          ? 'admin'
          : 'student',

      isVerified: true,

      otp: {
        code: otp,
        expiresAt: new Date(
          Date.now() + 10 * 60_000
        ),
      },
    });

    console.log('Generated OTP:', otp);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      userId: user._id,
    });

  } catch (error) {
    console.log(
      'REGISTER ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// =========================
// VERIFY OTP
// =========================

export async function verifyOtp(
  req,
  res
) {
  try {
    const { email, code } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.otp?.code) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found',
      });
    }

    if (user.otp.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (
      user.otp.expiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    user.isVerified = true;
    user.otp = undefined;

    await user.save();

    const token = signToken({
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      token,
      user: sanitize(user),
    });

  } catch (error) {
    console.log(
      'VERIFY OTP ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}

// =========================
// LOGIN
// =========================

export async function login(
  req,
  res
) {
  try {
    const { email, password } =
      req.body;

    // Find User
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      });
    }

    // Compare Password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      });
    }

    // Generate JWT
    const token = signToken({
      id: user._id,
      role: user.role,
    });

    // Success
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(
      'LOGIN ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}

// =========================
// FORGOT PASSWORD
// =========================

export async function forgotPassword(
  req,
  res
) {
  try {
    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
      });
    }

    const token =
      crypto.randomBytes(32)
        .toString('hex');

    user.resetToken = {
      token,
      expiresAt: new Date(
        Date.now() + 30 * 60_000
      ),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        'Reset password token generated',
      token,
    });

  } catch (error) {
    console.log(
      'FORGOT PASSWORD ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}

// =========================
// RESET PASSWORD
// =========================

export async function resetPassword(
  req,
  res
) {
  try {
    const {
      email,
      token,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (
      !user ||
      !user.resetToken?.token
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }

    if (
      user.resetToken.token !== token
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (
      user.resetToken.expiresAt <
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Token expired',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password =
      hashedPassword;

    user.resetToken = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        'Password reset successful',
    });

  } catch (error) {
    console.log(
      'RESET PASSWORD ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}

// =========================
// CURRENT USER
// =========================

export async function me(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: sanitize(req.user),
    });

  } catch (error) {
    console.log('ME ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}