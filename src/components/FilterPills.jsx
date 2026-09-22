export default function FilterPills({ options, active, onChange }) {
  return (
    <div className="filter-pills" role="group" aria-label="Filter">
      {options.map((opt) => (
        <button
          key={opt}
          className={`filter-pill ${active === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
          aria-pressed={active === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
