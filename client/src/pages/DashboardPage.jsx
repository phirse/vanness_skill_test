import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAssignments } from '../api/assignments.api';
import { getStudents } from '../api/students.api';
import { getMySubmission } from '../api/submissions.api';
import { isAfter, isWithinInterval, addDays } from 'date-fns';

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
      <span className="text-3xl font-bold text-indigo-600">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

function InstructorDashboard() {
  const [stats, setStats] = useState({ students: 0, assignments: 0, dueThisWeek: 0 });

  useEffect(() => {
    Promise.all([getStudents(), getAssignments()]).then(([students, assignments]) => {
      const now = new Date();
      const weekEnd = addDays(now, 7);
      const dueThisWeek = assignments.filter((a) =>
        isWithinInterval(new Date(a.dueDate), { start: now, end: weekEnd })
      ).length;
      setStats({ students: students.length, assignments: assignments.length, dueThisWeek });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Students" value={stats.students} />
        <StatCard label="Total Assignments" value={stats.assignments} />
        <StatCard label="Due This Week" value={stats.dueThisWeek} />
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submitted, setSubmitted] = useState(0);

  useEffect(() => {
    getAssignments().then(async (list) => {
      setAssignments(list);
      const results = await Promise.all(list.map((a) => getMySubmission(a._id)));
      setSubmitted(results.filter((s) => s?.submittedAt).length);
    });
  }, []);

  const now = new Date();
  const pending = assignments.filter(
    (a) => !isAfter(now, new Date(a.dueDate))
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Assignments" value={assignments.length} />
        <StatCard label="Submitted" value={submitted} />
        <StatCard label="Pending" value={pending} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'instructor' ? <InstructorDashboard /> : <StudentDashboard />;
}
