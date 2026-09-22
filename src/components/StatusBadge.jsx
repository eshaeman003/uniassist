const STATUS_MAP = {
  Submitted: 'badge-info',
  'Under Review': 'badge-warning',
  'In Progress': 'badge-lilac',
  Resolved: 'badge-success',
  Open: 'badge-info',
  Lost: 'badge-error',
  Found: 'badge-success',
  Low: 'badge-neutral',
  Medium: 'badge-warning',
  High: 'badge-error',
  Active: 'badge-success',
  Inactive: 'badge-neutral',
  'Pending verification': 'badge-warning',
};

export default function StatusBadge({ status, dot = true }) {
  const cls = STATUS_MAP[status] || 'badge-neutral';
  return (
    <span className={`badge ${cls}`}>
      {dot && <span className="badge-dot" />}
      {status}
    </span>
  );
}
