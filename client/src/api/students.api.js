import axiosInstance from './axiosInstance';

export async function getStudents() {
  const res = await axiosInstance.get('/students');
  return res.data;
}

export async function getStudentDetail(id) {
  const res = await axiosInstance.get(`/students/${id}`);
  return res.data;
}
