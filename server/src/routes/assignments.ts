import { Router, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { protect } from '../middleware/auth';
import { requireInstructor } from '../middleware/role';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';

const router = Router();

// GET /api/assignments
router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find()
      .populate('createdBy', 'name')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/assignments/:id
router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name');
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.json(assignment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/assignments
router.post('/', protect, requireInstructor, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, totalPoints } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      totalPoints,
      createdBy: req.userId,
    });
    res.status(201).json(assignment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/assignments/:id
router.put('/:id', protect, requireInstructor, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.json(assignment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', protect, requireInstructor, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    await Submission.deleteMany({ assignment: req.params.id });
    res.json({ message: 'Assignment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
