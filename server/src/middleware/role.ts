import { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth';
import User from '../models/User';

export const requireInstructor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('role');
    if (!user || user.role !== 'instructor') {
      res.status(403).json({ message: 'Instructor access required' });
      return;
    }
    req.userRole = 'instructor';
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const attachRole = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('role');
    if (user) {
      req.userRole = user.role;
    }
    next();
  } catch {
    next();
  }
};
