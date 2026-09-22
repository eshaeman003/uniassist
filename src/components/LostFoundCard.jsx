import { Link } from 'react-router-dom';
import { PackageSearch, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { timeAgo } from '../utils/format';

export default function LostFoundCard({ item, basePath = '/app/lost-found' }) {
  return (
    <Link to={`${basePath}/${item.id}`} className="card card-interactive lf-card" aria-label={`View ${item.title}`}>
      <div className="lf-card-image">
        {item.imageDataUrl ? <img src={item.imageDataUrl} alt="" /> : <PackageSearch size={34} />}
      </div>
      <div className="lf-card-body">
        <div className="report-card-top">
          <span className="lf-card-title">{item.title}</span>
          <StatusBadge status={item.status === 'Resolved' ? 'Resolved' : item.type} />
        </div>
        <div className="lf-card-meta">
          <MapPin size={13} /> {item.location}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <span className="badge badge-neutral">{item.category}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>{timeAgo(item.date)}</span>
        </div>
      </div>
    </Link>
  );
}
