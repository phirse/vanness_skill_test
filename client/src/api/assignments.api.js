import axiosInstance from './axiosInstance';

export async function getAssignments() {
  const res = await axiosInstance.get('/assignments');
  return res.data;
}

export async function getAssignment(id) {
  const res = await axiosInstance.get(`/assignments/${id}`);
  return res.data;
}

export async function createAssignment(data) {
  const res = await axiosInstance.post('/assignments', data);
  return res.data;
}

export async function updateAssignment(id, data) {
  const res = await axiosInstance.put(`/assignments/${id}`, data);
  return res.data;
}

export async function deleteAssignment(id) {
  await axiosInstance.delete(`/assignments/${id}`);
}
