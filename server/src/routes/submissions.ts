import mongoose from 'mongoose';
import { Router, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { protect } from '../middleware/auth';
import { requireInstructor, attachRole } from '../middleware/role';
import User from '../models/User';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import type { INote } from '../models/Submission';

const router = Router();

// GET /api/submissions/assignment/:id — all students + merged submissions (instructor)
router.get(
  '/assignment/:id',
  protect,
  requireInstructor,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }

      const students = await User.find({ role: 'student' }).select('-password');
      const submissions = await Submission.find({ assignment: req.params.id }).populate(
        'notes.author',
        'name'
      );

      const subMap = new Map(submissions.map((s) => [s.student.toString(), s]));

      const rows = students.map((student) => {
        const submission = subMap.get(student._id.toString()) ?? null;
        let status: 'not_submitted' | 'submitted' | 'late' = 'not_submitted';
        if (submission?.submittedAt) {
          status = submission.submittedAt > assignment.dueDate ? 'late' : 'submitted';
        }
        return { student, submission, status };
      });

      res.json(rows);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/submissions/my/:assignmentId — own submission
router.get(
  '/my/:assignmentId',
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const submission = await Submission.findOne({
        assignment: req.params.assignmentId,
        student: req.userId,
      }).populate('notes.author', 'name');
      res.json(submission ?? null);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST /api/submissions/:assignmentId/submit — student submits
router.post(
  '/:assignmentId/submit',
  protect,
  attachRole,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.userRole === 'instructor') {
        res.status(403).json({ message: 'Instructors cannot submit assignments' });
        return;
      }

      const submission = await Submission.findOneAndUpdate(
        { assignment: req.params.assignmentId, student: req.userId },
        { $set: { submittedAt: new Date() } },
        { upsert: true, new: true }
      );
      res.json(submission);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PATCH /api/submissions/:submissionId/grade — instructor grades
router.patch(
  '/:submissionId/grade',
  protect,
  requireInstructor,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const submission = await Submission.findById(req.params.submissionId);
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      const assignment = await Assignment.findById(submission.assignment);
      if (!assignment) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }

      const score = Number(req.body.score);
      if (score < 0 || score > assignment.totalPoints) {
        res.status(400).json({ message: `Score must be between 0 and ${assignment.totalPoints}` });
        return;
      }

      submission.score = score;
      await submission.save();
      res.json(submission);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST /api/submissions/:submissionId/notes — add note (both roles)
router.post(
  '/:submissionId/notes',
  protect,
  attachRole,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const submission = await Submission.findById(req.params.submissionId);
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      // Students can only add notes to their own submission
      if (req.userRole === 'student' && submission.student.toString() !== req.userId) {
        res.status(403).json({ message: 'Not authorized' });
        return;
      }

      const user = await User.findById(req.userId).select('role');
      const authorRole: 'student' | 'instructor' = user?.role ?? 'student';

      submission.notes.push({
        author: new mongoose.Types.ObjectId(req.userId),
        authorRole,
        text: req.body.text,
      } as INote);

      await submission.save();
      await submission.populate('notes.author', 'name');
      res.json(submission);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
