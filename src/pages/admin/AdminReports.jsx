import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileWarning, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getReportsForUniversity, subscribeToReports } from '../../services/reportService';
import { REPORT_CATEGORIES, REPORT_STATUSES, REPORT_PRIORITIES } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import SearchBar from '../../components/SearchBar';
import Select from '../../components/Select';
import EmptyState from '../../components/EmptyState';
import { formatDateShort } from '../../utils/format';

export default function AdminReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [query, setQuery] = useState('');

  const load = async () => {
    const r = await getReportsForUniversity(user.universityId);
    setReports(r);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToReports({ universityId: user.universityId }, load);
    return unsub;
  }, [user.universityId]);

  const filtered = useMemo(() => {
    return reports
      .filter((r) => status === 'All' || r.status === status)
      .filter((r) => category === 'All' || r.category === category)
      .filter((r) => priority === 'All' || r.priority === priority)
      .filter((r) => {
        const q = query.trim().toLowerCase();
        return !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reports, status, category, priority, query]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p>Review, triage, and update the status of student reports.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search reports..." />
      </div>
      <div className="toolbar filter-select-row">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          {REPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="All">All categories</option>
          {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="All">All priorities</option>
          {REPORT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileWarning} title="No reports match your filters." description="Try adjusting the search or filters above." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Submitted</th>
                <th>Privacy</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} onClick={() => navigate(`/admin/reports/${r.id}`)} tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/reports/${r.id}`)}>
                  <td style={{ fontWeight: 600 }}>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>{r.building}</td>
                  <td>{formatDateShort(r.createdAt)}</td>
                  <td>{r.isAnonymous ? <span className="badge badge-neutral"><EyeOff size={11} /> Anonymous</span> : <span className="badge badge-neutral">Public</span>}</td>
                  <td>{r.priority}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}