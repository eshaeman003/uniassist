import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getReportsForUser, subscribeToReports } from '../../services/reportService';
import ReportCard from '../../components/ReportCard';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import FilterPills from '../../components/FilterPills';
import Button from '../../components/Button';

const FILTERS = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];

export default function ReportsList() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const load = async () => {
    const r = await getReportsForUser(user.id);
    setReports(r);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToReports({ userId: user.id }, load);
    return unsub;
  }, [user.id]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesFilter = filter === 'All' || r.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [reports, filter, query]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My Reports</h1>
          <p>Track every problem you&rsquo;ve reported on campus.</p>
        </div>
        <Link to="/app/reports/new"><Button variant="primary" icon={PlusCircle}>Report a Problem</Button></Link>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search your reports..." />
        <FilterPills options={FILTERS} active={filter} onChange={setFilter} />
      </div>

      {!loading && filtered.length === 0 ? (
        reports.length === 0 ? (
          <EmptyState
            icon={FileWarning}
            title="No reports yet."
            description="If something needs attention on campus, let us know."
            action={<Link to="/app/reports/new"><Button variant="primary" size="sm">Report a Problem</Button></Link>}
          />
        ) : (
          <EmptyState icon={FileWarning} title="No matching reports." description="Try a different search term or filter." />
        )
      ) : (
        <div className="grid-auto">
          {filtered.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}