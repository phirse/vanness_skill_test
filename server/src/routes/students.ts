import { Router, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { protect } from '../middleware/auth';
import { requireInstructor } from '../middleware/role';
import User from '../models/User';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';

const router = Router();

// GET /api/students — list all students
router.get('/', protect, requireInstructor, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students/:id — student info + all assignments + merged submissions
router.get('/:id', protect, requireInstructor, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    const assignments = await Assignment.find().populate('createdBy', 'name').sort({ dueDate: 1 });
    const submissions = await Submission.find({ student: student._id });

    const subMap = new Map(submissions.map((s) => [s.assignment.toString(), s]));

    const rows = assignments.map((assignment) => {
      const submission = subMap.get(assignment._id.toString()) ?? null;
      let status: 'not_submitted' | 'submitted' | 'late' = 'not_submitted';
      if (submission?.submittedAt) {
        status = submission.submittedAt > assignment.dueDate ? 'late' : 'submitted';
      }
      return { assignment, submission, status };
    });

    res.json({ student, rows });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
