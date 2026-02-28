import { isAfter } from 'date-fns';

export function computeStatus(submission, dueDate) {
  if (!submission?.submittedAt) return 'not_submitted';
  return isAfter(new Date(submission.submittedAt), new Date(dueDate)) ? 'late' : 'submitted';
}

export function computePercentage(score, totalPoints) {
  if (score === undefined || score === null) return null;
  return Math.round((score / totalPoints) * 100);
}

export function computeLetterGrade(pct) {
  if (pct === null) return 'N/A';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}
