import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, PackageSearch, MessageCircle } from 'lucide-react';
import { getItemById } from '../../services/lostFoundService';
import { onStorageChange } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Textarea from '../../components/Textarea';
import { formatDate } from '../../utils/format';

export default function LostFoundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState(() => getItemById(id));
  const [claimOpen, setClaimOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = () => setItem(getItemById(id));
    load();
    return onStorageChange(load);
  }, [id]);

  if (!item) {
    return (
      <EmptyState
        title="Item not found"
        description="This post may have been removed, or the link is incorrect."
        action={<Link to="/app/lost-found" className="btn btn-primary btn-sm">Back to Lost & Found</Link>}
      />
    );
  }

  const submitClaim = () => {
    setClaimOpen(false);
    setMessage('');
    showToast('Your message has been sent to the poster.');
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18, paddingLeft: 4 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.1fr', alignItems: 'start', gap: 24 }}>
        <div className="lf-card-image" style={{ borderRadius: 'var(--radius-lg)', height: 320, border: '1px solid var(--border)' }}>
          {item.imageDataUrl ? (
            <img src={item.imageDataUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
          ) : (
            <PackageSearch size={56} />
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <h1 style={{ fontSize: '1.35rem' }}>{item.title}</h1>
            <StatusBadge status={item.status === 'Resolved' ? 'Resolved' : item.type} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="badge badge-neutral">{item.category}</span>
            <span className="badge badge-neutral"><MapPin size={11} /> {item.location}</span>
            <span className="badge badge-neutral"><Calendar size={11} /> {formatDate(item.date)}</span>
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 18 }}>{item.description}</p>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-faint)', marginBottom: 20 }}>
            Posted by a fellow student. Contact details are only shared once a claim is confirmed, to protect privacy.
          </div>

          {item.status === 'Resolved' ? (
            <span className="badge badge-success" style={{ padding: '10px 16px' }}>This item has been marked as resolved</span>
          ) : (
            <Button variant="primary" icon={MessageCircle} onClick={() => setClaimOpen(true)}>
              I think this is mine
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        title="I think this is mine"
        footer={
          <>
            <Button variant="ghost" onClick={() => setClaimOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={submitClaim}>Send Message</Button>
          </>
        }
      >
        <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.55 }}>
          Describe an identifying detail so the poster can confirm this is really yours. This is a prototype — no
          message is actually delivered yet.
        </p>
        <Textarea placeholder="e.g. It has a small scratch on the back and a photo of my dog inside." value={message} onChange={(e) => setMessage(e.target.value)} />
      </Modal>
    </div>
  );
}
