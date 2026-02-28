import axiosInstance from './axiosInstance';
import type { User, StudentDetailRow } from '../types';

export async function getStudents(): Promise<User[]> {
  const res = await axiosInstance.get<User[]>('/students');
  return res.data;
}

export async function getStudentDetail(
  id: string
): Promise<{ student: User; rows: StudentDetailRow[] }> {
  const res = await axiosInstance.get<{ student: User; rows: StudentDetailRow[] }>(`/students/${id}`);
  return res.data;
}
