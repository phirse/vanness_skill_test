import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { getStudentDetail } from '../api/students.api';
import { computePercentage, computeLetterGrade } from '../utils/grading';
import StatusBadge from '../components/ui/StatusBadge';
import LetterGradeBadge from '../components/ui/LetterGradeBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { User, StudentDetailRow } from '../types';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);
  const [rows, setRows] = useState<StudentDetailRow[]>([]);

  useEffect(() => {
    if (id) {
      getStudentDetail(id).then((data) => {
        setStudent(data.student);
        setRows(data.rows);
      });
    }
  }, [id]);

  if (!student) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>Email: {student.email}</p>
          {student.studentId && <p>Student ID: {student.studentId}</p>}
          {student.academicYear && <p>Academic Year: {student.academicYear}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Assignments</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Assignment</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(({ assignment, submission, status }) => {
                const pct = computePercentage(submission?.score, assignment.totalPoints);
                const grade = computeLetterGrade(pct);
                return (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{assignment.title}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {submission?.score !== undefined
                        ? `${submission.score}/${assignment.totalPoints}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <LetterGradeBadge grade={grade} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No assignments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
