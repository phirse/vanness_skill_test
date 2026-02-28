import axiosInstance from './axiosInstance';
import type { Submission, StudentSubmissionRow } from '../types';

export async function getSubmissionsForAssignment(assignmentId: string): Promise<StudentSubmissionRow[]> {
  const res = await axiosInstance.get<StudentSubmissionRow[]>(`/submissions/assignment/${assignmentId}`);
  return res.data;
}

export async function getMySubmission(assignmentId: string): Promise<Submission | null> {
  const res = await axiosInstance.get<Submission | null>(`/submissions/my/${assignmentId}`);
  return res.data;
}

export async function submitAssignment(assignmentId: string): Promise<Submission> {
  const res = await axiosInstance.post<Submission>(`/submissions/${assignmentId}/submit`);
  return res.data;
}

export async function gradeSubmission(submissionId: string, score: number): Promise<Submission> {
  const res = await axiosInstance.patch<Submission>(`/submissions/${submissionId}/grade`, { score });
  return res.data;
}

export async function addNote(submissionId: string, text: string): Promise<Submission> {
  const res = await axiosInstance.post<Submission>(`/submissions/${submissionId}/notes`, { text });
  return res.data;
}
