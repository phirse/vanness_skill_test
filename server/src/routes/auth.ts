import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign({ id }, secret, { expiresIn } as jwt.SignOptions);
};

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, academicYear, studentId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    const user = await User.create({ name, email, password, role, academicYear, studentId });
    const token = signToken(user.id as string);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        academicYear: user.academicYear,
        studentId: user.studentId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = signToken(user.id as string);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        academicYear: user.academicYear,
        studentId: user.studentId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      academicYear: user.academicYear,
      studentId: user.studentId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
