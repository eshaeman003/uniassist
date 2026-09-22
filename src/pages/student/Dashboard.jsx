import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, PackagePlus, Megaphone, FileWarning, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getReportsForUser, reportStats, subscribeToReports } from '../../services/reportService';
import { getAnnouncementsForUniversity, subscribeToAnnouncements } from '../../services/announcementService';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import EmptyState from '../../components/EmptyState';
import { greeting, formatDateShort } from '../../utils/format';

const QUICK_ACTIONS = [
  { to: '/app/reports/new', label: 'Report a Problem', desc: 'Flag a campus issue', icon: PlusCircle },
  { to: '/app/lost-found/new?type=Lost', label: 'Lost Something?', desc: 'Post a lost item', icon: Search },
  { to: '/app/lost-found/new?type=Found', label: 'Found Something?', desc: 'Post a found item', icon: PackagePlus },
  { to: '/app/announcements', label: 'View Announcements', desc: 'Campus news & notices', icon: Megaphone },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [r, a] = await Promise.all([
      getReportsForUser(user.id),
      getAnnouncementsForUniversity(user.universityId),
    ]);
    setReports(r);
    setAnnouncements(a.slice(0, 3));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubReports = subscribeToReports({ userId: user.id }, loadData);
    const unsubAnnouncements = subscribeToAnnouncements(user.universityId, loadData);
    return () => { unsubReports(); unsubAnnouncements(); };
  }, [user.id, user.universityId]);

  const stats = reportStats(reports);
  const firstName = user.name.split(' ')[0];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{greeting()}, {firstName}.</h1>
          <p>Here&rsquo;s what&rsquo;s happening around your campus.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 28 }}>
        <StatCard label="My Reports" value={loading ? '—' : stats.total} icon={FileWarning} />
        <StatCard label="In Progress" value={loading ? '—' : stats.inProgress} icon={Clock} tone="warning" />
        <StatCard label="Resolved" value={loading ? '—' : stats.resolved} icon={CheckCircle2} tone="success" />
      </div>

      <h2 className="section-title">Quick actions</h2>
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {QUICK_ACTIONS.map((a) => (
          <Link to={a.to} className="card card-interactive" key={a.label} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px' }}>
            <div className="step-icon-wrap" style={{ marginBottom: 2 }}><a.icon size={19} /></div>
            <strong style={{ fontSize: '0.92rem' }}>{a.label}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.desc}</span>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent reports</h2>
            <Link to="/app/reports" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lilac-dark)' }}>View all</Link>
          </div>
          {!loading && reports.length === 0 ? (
            <EmptyState
              icon={FileWarning}
              title="No reports yet."
              description="If something needs attention on campus, let us know."
              action={<Link to="/app/reports/new"><button className="btn btn-primary btn-sm">Report a Problem</button></Link>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reports.slice(0, 3).map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Campus activity</h2>
            <Link to="/app/announcements" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lilac-dark)' }}>View all</Link>
          </div>
          {!loading && announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements yet." description="Your university hasn't posted anything recently." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.map((a) => (
                <div className="card card-tight announcement-card" key={a.id}>
                  <div className="announcement-card-top">
                    <h4>{a.title}</h4>
                    <span className="badge badge-lilac">{a.category}</span>
                  </div>
                  <p>{a.description}</p>
                  <span className="announcement-date">{formatDateShort(a.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}