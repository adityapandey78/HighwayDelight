import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiResponse } from '../types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Not authorized to access this route',
      };
      res.status(401).json(response);
      return;
    }

    try {
      // Verify token -- Added auth middleware
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
        };
        res.status(404).json(response);
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Not authorized to access this route',
      };
      res.status(401).json(response);
      return;
    }
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Server error in auth middleware',
    };
    res.status(500).json(response);
  }
};