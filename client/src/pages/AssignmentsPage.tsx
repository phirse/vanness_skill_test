import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../api/assignments.api';
import { getMySubmission } from '../api/submissions.api';
import { computeStatus, computePercentage, computeLetterGrade } from '../utils/grading';
import StatusBadge from '../components/ui/StatusBadge';
import LetterGradeBadge from '../components/ui/LetterGradeBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import type { Assignment, Submission } from '../types';

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  totalPoints: string;
}

const emptyForm: FormState = { title: '', description: '', dueDate: '', totalPoints: '' };

function InstructorView() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => getAssignments().then(setAssignments);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (a: Assignment) => {
    setEditId(a._id);
    setForm({
      title: a.title,
      description: a.description ?? '',
      dueDate: a.dueDate.slice(0, 10),
      totalPoints: String(a.totalPoints),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        dueDate: form.dueDate,
        totalPoints: Number(form.totalPoints),
      };
      if (editId) {
        await updateAssignment(editId, payload);
        toast.success('Assignment updated');
      } else {
        await createAssignment(payload);
        toast.success('Assignment created');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAssignment(deleteId);
      toast.success('Assignment deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
        >
          + New Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'New'} Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Total Points</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.totalPoints}
                  onChange={(e) => setForm({ ...form, totalPoints: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  <Link to={`/assignments/${a._id}`} className="text-indigo-600 hover:underline">
                    {a.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {format(new Date(a.dueDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-gray-600">{a.totalPoints}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-indigo-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(a._id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this assignment and all submissions?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

interface StudentRow {
  assignment: Assignment;
  submission: Submission | null;
}

function StudentView() {
  const [rows, setRows] = useState<StudentRow[]>([]);

  useEffect(() => {
    getAssignments().then(async (assignments) => {
      const subs = await Promise.all(assignments.map((a) => getMySubmission(a._id)));
      setRows(assignments.map((a, i) => ({ assignment: a, submission: subs[i] })));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(({ assignment, submission }) => {
              const status = computeStatus(submission, assignment.dueDate);
              const pct = computePercentage(submission?.score, assignment.totalPoints);
              const grade = computeLetterGrade(pct);
              return (
                <tr key={assignment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link to={`/assignments/${assignment._id}`} className="text-indigo-600 hover:underline">
                      {assignment.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{assignment.totalPoints}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <LetterGradeBadge grade={grade} />
                    {pct !== null && (
                      <span className="ml-2 text-xs text-gray-500">{pct}%</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  return user?.role === 'instructor' ? <InstructorView /> : <StudentView />;
}
