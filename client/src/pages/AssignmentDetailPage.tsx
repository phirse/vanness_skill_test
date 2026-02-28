import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAssignment } from '../api/assignments.api';
import {
  getSubmissionsForAssignment,
  getMySubmission,
  submitAssignment,
  gradeSubmission,
  addNote,
} from '../api/submissions.api';
import { computeStatus, computePercentage, computeLetterGrade } from '../utils/grading';
import StatusBadge from '../components/ui/StatusBadge';
import LetterGradeBadge from '../components/ui/LetterGradeBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Assignment, Submission, StudentSubmissionRow } from '../types';

function InstructorView({ assignment }: { assignment: Assignment }) {
  const [rows, setRows] = useState<StudentSubmissionRow[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [noteTexts, setNoteTexts] = useState<Record<string, string>>({});

  const load = () =>
    getSubmissionsForAssignment(assignment._id).then((data) => {
      setRows(data);
      const init: Record<string, string> = {};
      data.forEach((r) => {
        if (r.submission?.score !== undefined) {
          init[r.submission._id] = String(r.submission.score);
        }
      });
      setScores(init);
    });

  useEffect(() => { load(); }, []);

  const handleGrade = async (submissionId: string) => {
    const score = Number(scores[submissionId]);
    try {
      await gradeSubmission(submissionId, score);
      toast.success('Grade saved');
      load();
    } catch {
      toast.error('Failed to save grade');
    }
  };

  const handleNote = async (submissionId: string) => {
    const text = noteTexts[submissionId]?.trim();
    if (!text) return;
    try {
      await addNote(submissionId, text);
      toast.success('Note added');
      setNoteTexts({ ...noteTexts, [submissionId]: '' });
      load();
    } catch {
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Student Submissions</h2>
      {rows.map((row) => {
        const status = row.status;
        const sub = row.submission;
        const pct = computePercentage(sub?.score, assignment.totalPoints);
        const grade = computeLetterGrade(pct);
        return (
          <div key={row.student.id} className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{row.student.name}</p>
                <p className="text-xs text-gray-400">{row.student.email}</p>
              </div>
              <StatusBadge status={status} />
            </div>

            {sub && (
              <>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={assignment.totalPoints}
                    value={scores[sub._id] ?? ''}
                    onChange={(e) => setScores({ ...scores, [sub._id]: e.target.value })}
                    placeholder={`Score / ${assignment.totalPoints}`}
                    className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleGrade(sub._id)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Save Grade
                  </button>
                  <LetterGradeBadge grade={grade} />
                  {pct !== null && <span className="text-xs text-gray-500">{pct}%</span>}
                </div>

                <div className="space-y-2">
                  {sub.notes.map((note) => (
                    <div key={note._id} className="bg-gray-50 rounded p-2 text-xs">
                      <span className="font-medium text-gray-700">{note.author.name}</span>
                      <span className="text-gray-400 ml-1">({note.authorRole})</span>
                      <p className="text-gray-600 mt-1">{note.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a note…"
                    value={noteTexts[sub._id] ?? ''}
                    onChange={(e) => setNoteTexts({ ...noteTexts, [sub._id]: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleNote(sub._id)}
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  >
                    Add Note
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
      {rows.length === 0 && (
        <p className="text-gray-400 text-sm">No students enrolled yet.</p>
      )}
    </div>
  );
}

function StudentView({ assignment }: { assignment: Assignment }) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => getMySubmission(assignment._id).then(setSubmission);
  useEffect(() => { load(); }, []);

  const status = computeStatus(submission, assignment.dueDate);
  const pct = computePercentage(submission?.score, assignment.totalPoints);
  const grade = computeLetterGrade(pct);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitAssignment(assignment._id);
      toast.success('Assignment submitted!');
      load();
    } catch {
      toast.error('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNote = async () => {
    if (!noteText.trim() || !submission) return;
    try {
      await addNote(submission._id, noteText.trim());
      toast.success('Note added');
      setNoteText('');
      load();
    } catch {
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <StatusBadge status={status} />
            {submission?.submittedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Submitted {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LetterGradeBadge grade={grade} />
            {pct !== null && (
              <span className="text-sm text-gray-500">
                {submission?.score}/{assignment.totalPoints} ({pct}%)
              </span>
            )}
          </div>
        </div>
        {!submission?.submittedAt && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Assignment'}
          </button>
        )}
      </div>

      {submission && (
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h3 className="font-semibold text-gray-700">Notes</h3>
          {submission.notes.map((note) => (
            <div key={note._id} className="bg-gray-50 rounded p-3 text-sm">
              <span className="font-medium text-gray-700">{note.author.name}</span>
              <span className="text-gray-400 ml-1 text-xs">({note.authorRole})</span>
              <p className="text-gray-600 mt-1">{note.text}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a note…"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleNote}
              className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (id) getAssignment(id).then(setAssignment);
  }, [id]);

  if (!assignment) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
        {assignment.description && (
          <p className="text-gray-500 mt-1">{assignment.description}</p>
        )}
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}</span>
          <span>Points: {assignment.totalPoints}</span>
          <span>By: {assignment.createdBy.name}</span>
        </div>
      </div>

      {user?.role === 'instructor' ? (
        <InstructorView assignment={assignment} />
      ) : (
        <StudentView assignment={assignment} />
      )}
    </div>
  );
}
