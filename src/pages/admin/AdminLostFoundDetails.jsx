import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getItemById, updateItemStatus, removeItem } from '../../services/lostFoundService';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDateShort } from '../../utils/format';

export default function AdminLostFoundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getItemById(id);
      setItem(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleResolve = async () => {
    const next = item.status === 'Resolved' ? 'Open' : 'Resolved';
    const ok = await updateItemStatus(item.id, next);
    if (ok !== null) {
      setItem((i) => ({ ...i, status: next }));
      showToast(next === 'Resolved' ? 'Marked as resolved.' : 'Marked as open again.');
    }
  };

  const handleRemove = async () => {
    await removeItem(item.id);
    showToast('Post removed.');
    navigate('/admin/lost-found');
  };

  if (loading) return null;

  if (!item) {
    return (
      <EmptyState
        title="Post not found"
        description="This post may have been removed, or the link is incorrect."
        action={
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/lost-found')}>
            Back to Lost &amp; Found
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18, paddingLeft: 4 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>{item.id}</span>
            <h1 style={{ fontSize: '1.3rem', marginTop: 4 }}>{item.title}</h1>
          </div>
          <StatusBadge status={item.type} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span className="badge badge-neutral">{item.category}</span>
          <span className="badge badge-neutral"><MapPin size={11} /> {item.location}</span>
          <span className="badge badge-neutral">Posted {formatDateShort(item.createdAt)}</span>
          {item.status === 'Resolved'
            ? <StatusBadge status="Resolved" />
            : <span className="badge badge-neutral">Open</span>}
        </div>

        {item.description && (
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 16 }}>
            {item.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleResolve}>
            {item.status === 'Resolved' ? 'Reopen' : 'Mark resolved'}
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirmRemove(true)}>
            Remove post
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={handleRemove}
        title="Remove this post?"
        description={`"${item.title}" will be permanently removed from Lost & Found.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
