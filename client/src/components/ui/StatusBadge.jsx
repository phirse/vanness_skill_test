const config = {
  not_submitted: { label: 'Not Submitted', className: 'bg-gray-100 text-gray-600' },
  submitted: { label: 'Submitted', className: 'bg-green-100 text-green-700' },
  late: { label: 'Late', className: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }) {
  const { label, className } = config[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
  );
}
