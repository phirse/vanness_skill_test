import axiosInstance from './axiosInstance';
import type { Assignment } from '../types';

export async function getAssignments(): Promise<Assignment[]> {
  const res = await axiosInstance.get<Assignment[]>('/assignments');
  return res.data;
}

export async function getAssignment(id: string): Promise<Assignment> {
  const res = await axiosInstance.get<Assignment>(`/assignments/${id}`);
  return res.data;
}

export async function createAssignment(data: {
  title: string;
  description?: string;
  dueDate: string;
  totalPoints: number;
}): Promise<Assignment> {
  const res = await axiosInstance.post<Assignment>('/assignments', data);
  return res.data;
}

export async function updateAssignment(
  id: string,
  data: { title?: string; description?: string; dueDate?: string; totalPoints?: number }
): Promise<Assignment> {
  const res = await axiosInstance.put<Assignment>(`/assignments/${id}`, data);
  return res.data;
}

export async function deleteAssignment(id: string): Promise<void> {
  await axiosInstance.delete(`/assignments/${id}`);
}
