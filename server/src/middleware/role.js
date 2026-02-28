import User from '../models/User.js';

export const requireInstructor = async (req, res, next) => {
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

export const attachRole = async (req, _res, next) => {
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
