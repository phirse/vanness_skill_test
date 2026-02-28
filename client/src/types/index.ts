export type Role = 'student' | 'instructor';
export type SubmissionStatus = 'not_submitted' | 'submitted' | 'late';
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  academicYear?: string;
  studentId?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalPoints: number;
  createdBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  author: { _id: string; name: string };
  authorRole: Role;
  text: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  assignment: string;
  student: { _id: string; name: string; email: string };
  submittedAt?: string;
  score?: number;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubmissionRow {
  student: User;
  submission: Submission | null;
  status: SubmissionStatus;
}

export interface StudentDetailRow {
  assignment: Assignment;
  submission: Submission | null;
  status: SubmissionStatus;
}
