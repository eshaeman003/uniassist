import { useEffect, useMemo, useState } from 'react';
import { PackageSearch, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getItemsForUniversity, updateItemStatus, removeItem, subscribeToLostFound } from '../../services/lostFoundService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import SearchBar from '../../components/SearchBar';
import FilterPills from '../../components/FilterPills';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDateShort } from '../../utils/format';

const TYPE_FILTERS = ['All', 'Lost', 'Found'];

export default function AdminLostFound() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [toRemove, setToRemove] = useState(null);

  const load = async () => {
    const data = await getItemsForUniversity(user.universityId);
    setItems(data);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToLostFound(user.universityId, load);
    return unsub;
  }, [user.universityId]);

  const filtered = useMemo(() => {
    return items
      .filter((i) => typeFilter === 'All' || i.type === typeFilter)
      .filter((i) => {
        const q = query.trim().toLowerCase();
        return !q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
      });
  }, [items, typeFilter, query]);

  const handleResolve = async (item) => {
    await updateItemStatus(item.id, item.status === 'Resolved' ? 'Open' : 'Resolved');
    showToast(item.status === 'Resolved' ? 'Marked as open again.' : 'Marked as resolved.');
  };

  const handleRemoveConfirmed = async () => {
    if (toRemove) {
      await removeItem(toRemove.id);
      showToast('Post removed.');
      setToRemove(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Lost &amp; Found</h1>
          <p>Moderate posts and mark items as resolved once claimed.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search posts..." />
      </div>
      <div className="toolbar">
        <FilterPills options={TYPE_FILTERS} active={typeFilter} onChange={setTypeFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No posts match your filters." description="Try a different search or filter." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Posted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td><StatusBadge status={item.type} /></td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{formatDateShort(item.createdAt)}</td>
                  <td>{item.status === 'Resolved' ? <StatusBadge status="Resolved" /> : <span className="badge badge-neutral">Open</span>}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="ghost" size="sm" icon={CheckCircle2} onClick={() => handleResolve(item)}>
                        {item.status === 'Resolved' ? 'Reopen' : 'Resolve'}
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => setToRemove(item)}>
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toRemove)}
        onClose={() => setToRemove(null)}
        onConfirm={handleRemoveConfirmed}
        title="Remove this post?"
        description={`"${toRemove?.title}" will be permanently removed from Lost & Found.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}