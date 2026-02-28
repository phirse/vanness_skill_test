import axiosInstance from './axiosInstance';

export async function getSubmissionsForAssignment(assignmentId) {
  const res = await axiosInstance.get(`/submissions/assignment/${assignmentId}`);
  return res.data;
}

export async function getMySubmission(assignmentId) {
  const res = await axiosInstance.get(`/submissions/my/${assignmentId}`);
  return res.data;
}

export async function submitAssignment(assignmentId) {
  const res = await axiosInstance.post(`/submissions/${assignmentId}/submit`);
  return res.data;
}

export async function gradeSubmission(submissionId, score) {
  const res = await axiosInstance.patch(`/submissions/${submissionId}/grade`, { score });
  return res.data;
}

export async function addNote(submissionId, text) {
  const res = await axiosInstance.post(`/submissions/${submissionId}/notes`, { text });
  return res.data;
}
