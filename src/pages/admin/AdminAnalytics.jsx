import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getReportsForUniversity, reportStats, subscribeToReports } from '../../services/reportService';
import { REPORT_CATEGORIES } from '../../data/mockData';
import StatCard from '../../components/StatCard';

function buildTrend(reports) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days.map((d) => {
    const dayStr = d.toDateString();
    const resolvedThatDay = reports.filter((r) =>
      r.timeline.some((t) => t.status === 'Resolved' && new Date(t.date).toDateString() === dayStr)
    ).length;
    return { name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), resolved: resolvedThatDay };
  });
}

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  const load = async () => {
    const r = await getReportsForUniversity(user.universityId);
    setReports(r);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToReports({ universityId: user.universityId }, load);
    return unsub;
  }, [user.universityId]);

  const stats = reportStats(reports);

  const categoryData = useMemo(() => {
    return REPORT_CATEGORIES.map((cat) => ({ name: cat, value: reports.filter((r) => r.category === cat).length }))
      .sort((a, b) => b.value - a.value);
  }, [reports]);

  const trend = useMemo(() => buildTrend(reports), [reports]);

  const topCategory = categoryData[0];
  const topCategoryShare = topCategory && stats.total > 0 ? Math.round((topCategory.value / stats.total) * 100) : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <p>Trends across every report submitted at {user.university?.shortName}.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total reports" value={stats.total} icon={TrendingUp} />
        <StatCard label="Submitted" value={stats.submitted} />
        <StatCard label="Under review" value={stats.underReview} tone="warning" />
        <StatCard label="Resolved" value={stats.resolved} tone="success" />
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20, alignItems: 'stretch' }}>
        <div className="card">
          <h3 className="section-title">Status distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Submitted', stats.submitted],
              ['Under Review', stats.underReview],
              ['In Progress', stats.inProgress],
              ['Resolved', stats.resolved],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: 4 }}>
                  <span>{label}</span><span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stats.total ? (value / stats.total) * 100 : 0}%`, background: 'var(--lilac-dark)', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Categories</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
                <Bar dataKey="value" fill="#8b6ccf" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">Resolution trend (last 14 days)</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
              <Line type="monotone" dataKey="resolved" stroke="#5b438f" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.total > 0 && topCategory?.value > 0 && (
        <div className="privacy-card">
          <div className="privacy-card-icon"><Lightbulb size={18} /></div>
          <div className="privacy-card-body">
            <h4>Insight</h4>
            <p>
              {topCategory.name}-related reports represent the largest share of campus issues this period,
              making up {topCategoryShare}% of all reports at {user.university?.shortName}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}