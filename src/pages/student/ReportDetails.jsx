import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, EyeOff, User } from 'lucide-react';
import { getReportById, subscribeToReports } from '../../services/reportService';
import StatusBadge from '../../components/StatusBadge';
import ReportTimeline from '../../components/ReportTimeline';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const r = await getReportById(id, false);
      if (mounted) {
        setReport(r);
        setLoading(false);
      }
    };
    load();
    const unsub = subscribeToReports({}, load);
    return () => {
      mounted = false;
      unsub();
    };
  }, [id]);

  if (loading) return null;

  if (!report) {
    return (
      <EmptyState
        title="Report not found"
        description="This report may have been removed, or the link is incorrect."
        action={
          <Link to="/app/reports">
            <Button variant="primary" size="sm">Back to My Reports</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18, paddingLeft: 4 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start', gap: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>{report.id}</span>
              <h1 style={{ fontSize: '1.3rem', marginTop: 4 }}>{report.title}</h1>
            </div>
            <StatusBadge status={report.status} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="badge badge-neutral">{report.category}</span>
            <span className="badge badge-neutral">
              <MapPin size={11} /> {report.building}{report.location ? ` — ${report.location}` : ''}
            </span>
            <span className="badge badge-neutral">{report.priority} priority</span>
            {report.isAnonymous ? (
              <span className="badge badge-lilac"><EyeOff size={11} /> Submitted anonymously</span>
            ) : (
              <span className="badge badge-neutral"><User size={11} /> Submitted publicly</span>
            )}
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{report.description}</p>

          {report.publicUpdate && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'var(--bg-subtle)' }}>
              <strong style={{ fontSize: '0.82rem' }}>Update from administration:</strong>
              <p style={{ fontSize: '0.88rem', marginTop: 4, color: 'var(--text-secondary)' }}>{report.publicUpdate}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Status timeline</h3>
          <ReportTimeline report={report} />
        </div>
      </div>
    </div>
  );
}
