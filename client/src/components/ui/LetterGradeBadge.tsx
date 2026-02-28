import type { LetterGrade } from '../../types';

const config: Record<LetterGrade, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
  'N/A': 'bg-gray-100 text-gray-500',
};

export default function LetterGradeBadge({ grade }: { grade: LetterGrade }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config[grade]}`}>
      {grade}
    </span>
  );
}
