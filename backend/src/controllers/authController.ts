import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { emailService } from '../services/emailService';
import { AuthRequest, AuthResponse, SignUpRequest, ApiResponse } from '../types';

// Generate JWT Token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, secret, { 
    expiresIn: process.env.JWT_EXPIRE || '7d' 
  } as jwt.SignOptions);
};

// Verify OTP using email service
const verifyOTP = (email: string, otp: string): boolean => {
  // Check if we're in development mode and allow demo OTP
  if (process.env.NODE_ENV === 'development' && otp === '123456') {
    return true;
  }
  
  // Use email service for real OTP verification
  return emailService.verifyOTP(email, otp);
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, dateOfBirth, password, otp }: SignUpRequest = req.body;

    // Validate required fields
    if (!name || !email || !dateOfBirth || !password || !otp) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide all required fields',
      };
      res.status(400).json(response);
      return;
    }

    // Verify OTP
    if (!verifyOTP(email, otp)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
      };
      res.status(400).json(response);
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User already exists with this email',
      };
      res.status(400).json(response);
      return;
    }

    // Create user (email verification happens after OTP verification)
    const user = await User.create({
      name,
      email,
      dateOfBirth: new Date(dateOfBirth),
      password,
      isEmailVerified: true, // Set to true since OTP was verified
    });

    // Generate token
    const token = generateToken((user._id as any).toString());

    const response: AuthResponse = {
      success: true,
      message: 'User registered successfully',
      user: {
        _id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val: any) => val.message).join(', ');
      const response: ApiResponse = {
        success: false,
        message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: AuthRequest = req.body;

    // Validate email and password
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide email and password',
      };
      res.status(400).json(response);
      return;
    }

    // Check for user and include password -- auth controller
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials',
      };
      res.status(401).json(response);
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials',
      };
      res.status(401).json(response);
      return;
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    const response: AuthResponse = {
      success: true,
      message: 'User authenticated successfully',
      user: {
        _id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Signin error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = req.user;

    const response: ApiResponse = {
      success: true,
      message: 'User data retrieved successfully',
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get me error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide email and name',
      };
      res.status(400).json(response);
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User already exists with this email',
      };
      res.status(400).json(response);
      return;
    }

    // Send OTP email
    const otpSent = await emailService.sendOTPEmail(email);
    
    if (otpSent) {
      const response: ApiResponse = {
        success: true,
        message: 'OTP sent to your email successfully',
      };
      res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
      res.status(500).json(response);
    }
  } catch (error: any) {
    console.error('Send OTP error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide email address',
      };
      res.status(400).json(response);
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      const response: ApiResponse = {
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.',
      };
      res.status(200).json(response);
      return;
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken);

    if (emailSent) {
      const response: ApiResponse = {
        success: true,
        message: 'Password reset instructions sent to your email.',
      };
      res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
      res.status(500).json(response);
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide token and new password',
      };
      res.status(400).json(response);
      return;
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid or expired reset token',
      };
      res.status(400).json(response);
      return;
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    };
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Reset password error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};