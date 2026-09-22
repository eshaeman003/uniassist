import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileWarning, Clock, CheckCircle2, ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getReportsForUniversity, reportStats, subscribeToReports } from '../../services/reportService';
import { REPORT_CATEGORIES } from '../../data/mockData';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { timeAgo } from '../../utils/format';

const CATEGORY_COLORS = ['#8b6ccf', '#5b438f', '#a892dd', '#3a9b70', '#d69a35', '#c95c68', '#4a7fc9', '#716b7a'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const r = await getReportsForUniversity(user.universityId);
    setReports(r);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToReports({ universityId: user.universityId }, load);
    return unsub;
  }, [user.universityId]);

  const stats = reportStats(reports);

  const categoryData = useMemo(() => {
    return REPORT_CATEGORIES.map((cat) => ({
      name: cat,
      value: reports.filter((r) => r.category === cat).length,
    })).filter((d) => d.value > 0);
  }, [reports]);

  const statusData = useMemo(() => ([
    { name: 'Submitted', value: stats.submitted },
    { name: 'Review', value: stats.underReview },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
  ]), [stats]);

  const recent = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{user.university?.shortName} Administration</h1>
          <p>An overview of campus activity and open reports.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Total Reports" value={loading ? '—' : stats.total} icon={ClipboardList} />
        <StatCard label="Open Reports" value={loading ? '—' : stats.open} icon={FileWarning} tone="warning" />
        <StatCard label="In Progress" value={loading ? '—' : stats.inProgress} icon={Clock} />
        <StatCard label="Resolved" value={loading ? '—' : stats.resolved} icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 28, alignItems: 'stretch' }}>
        <div className="card">
          <h3 className="section-title">Reports by status</h3>
          {reports.length === 0 ? (
            <EmptyState title="No data yet" description="Reports will appear here once students start submitting them." />
          ) : (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
                  <Bar dataKey="value" fill="#8b6ccf" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Reports by category</h3>
          {categoryData.length === 0 ? (
            <EmptyState title="No data yet" description="Category breakdown will appear once reports come in." />
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                    {categoryData.map((entry, idx) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Recent reports</h2>
        <Link to="/admin/reports" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lilac-dark)' }}>View all</Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState icon={FileWarning} title="No reports yet." description="Student reports will show up here as soon as they're submitted." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReportRow({ report }) {
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(`/admin/reports/${report.id}`)} tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter') && navigate(`/admin/reports/${report.id}`)}>
      <td>
        <div style={{ fontWeight: 600 }}>{report.title}</div>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)' }}>{report.id}</div>
      </td>
      <td>{report.category}</td>
      <td>{report.priority}</td>
      <td>{timeAgo(report.createdAt)}</td>
      <td><StatusBadge status={report.status} /></td>
    </tr>
  );
}