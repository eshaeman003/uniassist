import { useEffect, useMemo, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAnnouncementsForUniversity } from '../../services/announcementService';
import { onStorageChange } from '../../services/storage';
import { ANNOUNCEMENT_CATEGORIES } from '../../data/mockData';
import EmptyState from '../../components/EmptyState';
import FilterPills from '../../components/FilterPills';
import { formatDate } from '../../utils/format';

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = () => setAnnouncements(getAnnouncementsForUniversity(user.universityId));
    load();
    return onStorageChange(load);
  }, [user.universityId]);

  const filtered = useMemo(
    () => announcements.filter((a) => filter === 'All' || a.category === filter),
    [announcements, filter]
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Announcements</h1>
          <p>Updates and notices from {user.university?.shortName}.</p>
        </div>
      </div>

      <div className="toolbar">
        <FilterPills options={['All', ...ANNOUNCEMENT_CATEGORIES]} active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements." description="There's nothing posted in this category yet." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          {filtered.map((a) => (
            <div className="card announcement-card" key={a.id}>
              <div className="announcement-card-top">
                <h4>{a.title}</h4>
                <span className="badge badge-lilac">{a.category}</span>
              </div>
              <p>{a.description}</p>
              <span className="announcement-date">{formatDate(a.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
