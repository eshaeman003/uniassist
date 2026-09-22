export default function StatCard({ label, value, icon: Icon, trend, tone = 'lilac' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <span className="stat-card-icon" style={tone !== 'lilac' ? { background: `var(--${tone}-bg)`, color: `var(--${tone})` } : undefined}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <span className="stat-card-value">{value}</span>
      {trend && <span className="stat-card-trend">{trend}</span>}
    </div>
  );
}
