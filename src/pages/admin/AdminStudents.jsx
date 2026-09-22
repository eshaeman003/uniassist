import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentsForUniversity } from '../../services/universityService';
import SearchBar from '../../components/SearchBar';
import FilterPills from '../../components/FilterPills';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { formatDateShort } from '../../utils/format';

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

export default function AdminStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getStudentsForUniversity(user.universityId).then(setStudents);
  }, [user.universityId]);

  const filtered = useMemo(() => {
    return students
      .filter((s) => statusFilter === 'All' || s.status === statusFilter)
      .filter((s) => {
        const q = query.trim().toLowerCase();
        return !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      });
  }, [students, query, statusFilter]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Students</h1>
          <p>{students.length} students registered at {user.university?.shortName}.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, ID, or email..." />
      </div>
      <div className="toolbar">
        <FilterPills options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No students match your search." description="Try a different name, ID, or filter." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>University</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.studentId}</td>
                  <td>{user.university?.shortName}</td>
                  <td>{s.email}</td>
                  <td>{formatDateShort(s.createdAt)}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}