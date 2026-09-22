export default function UniversityBadge({ university }) {
  if (!university) return null;
  return (
    <span className="university-badge">
      <span className="university-badge-mark">{university.shortName?.slice(0, 3)}</span>
      {university.shortName}
    </span>
  );
}
