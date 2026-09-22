import { Link } from 'react-router-dom';
import { MapPin, EyeOff } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { timeAgo } from '../utils/format';

export default function ReportCard({ report, basePath = '/app/reports' }) {
  return (
    <Link to={`${basePath}/${report.id}`} className="card card-interactive report-card" aria-label={`View report ${report.id}`}>
      <div className="report-card-top">
        <span className="report-card-id">{report.id}</span>
        <StatusBadge status={report.status} />
      </div>
      <span className="report-card-title">{report.title}</span>
      <div className="report-card-meta">
        <span>{report.category}</span>
        <span className="dot-sep">
          <MapPin size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
          {report.building}
        </span>
      </div>
      <div className="report-card-footer">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>{timeAgo(report.createdAt)}</span>
        {report.isAnonymous && (
          <span className="badge badge-neutral">
            <EyeOff size={11} /> Anonymous
          </span>
        )}
      </div>
    </Link>
  );
}
