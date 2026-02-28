import axiosInstance from './axiosInstance';

export async function login(email, password) {
  const res = await axiosInstance.post('/auth/login', { email, password });
  return res.data;
}

export async function register(data) {
  const res = await axiosInstance.post('/auth/register', data);
  return res.data;
}

export async function getMe() {
  const res = await axiosInstance.get('/auth/me');
  return res.data;
}
