import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, PackageSearch, MessageCircle, CheckCircle2 } from 'lucide-react';
import { getItemById } from '../../services/lostFoundService';
import { onStorageChange } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import { formatDate } from '../../utils/format';

export default function LostFoundItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState(() => getItemById(id));
  const [claimOpen, setClaimOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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

  const handleSendClaim = () => {
    setSent(true);
    showToast('Your message has been sent to the poster.');
    setTimeout(() => {
      setClaimOpen(false);
      setSent(false);
      setMessage('');
    }, 900);
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18, paddingLeft: 4 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 24 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="lf-card-image" style={{ height: 320 }}>
            {item.imageDataUrl ? <img src={item.imageDataUrl} alt={item.title} /> : <PackageSearch size={56} />}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <StatusBadge status={item.status === 'Resolved' ? 'Resolved' : item.type} />
            <span className="badge badge-neutral">{item.category}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 14 }}>{item.title}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <MapPin size={15} /> {item.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Calendar size={15} /> {formatDate(item.date)}
            </span>
          </div>

          <div className="card card-tight" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{item.description}</p>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: 20 }}>
            Posted by a fellow student. For privacy, contact details are only shared once a claim is confirmed.
          </p>

          {item.status === 'Resolved' ? (
            <StatusBadge status="Resolved" />
          ) : (
            <Button variant="primary" size="lg" icon={MessageCircle} onClick={() => setClaimOpen(true)}>
              I think this is mine
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        title="Claim this item"
        footer={
          !sent && (
            <>
              <Button variant="ghost" onClick={() => setClaimOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSendClaim}>Send message</Button>
            </>
          )
        }
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle2 size={32} color="var(--success)" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message sent. The poster will be notified.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Describe an identifying detail about this item so the poster can confirm it&rsquo;s really yours.
            </p>
            <Textarea
              placeholder="e.g. It has a small scratch on the back, and my student card should be inside..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
