import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'student' | 'instructor';
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
