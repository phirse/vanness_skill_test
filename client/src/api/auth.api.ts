import axiosInstance from './axiosInstance';
import type { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  academicYear?: string;
  studentId?: string;
}): Promise<AuthResponse> {
  const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get<User>('/auth/me');
  return res.data;
}
