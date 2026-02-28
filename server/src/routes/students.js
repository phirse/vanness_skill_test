import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { requireInstructor } from '../middleware/role.js';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

const router = Router();

// GET /api/students — list all students
router.get('/', protect, requireInstructor, async (_req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students/:id — student info + all assignments + merged submissions
router.get('/:id', protect, requireInstructor, async (req, res) => {
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
      let status = 'not_submitted';
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
