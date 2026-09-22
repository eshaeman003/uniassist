import { useState } from 'react';
import { Bell, Lock, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

function ToggleRow({ label, description, defaultChecked = true }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} aria-label={label} />
        <span className="switch-track" />
      </label>
    </div>
  );
}

export default function Settings() {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage notifications and account preferences.</p>
        </div>
      </div>

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={17} /> Notifications
          </h3>
          <ToggleRow label="Report status updates" description="Get notified when a university admin updates one of your reports." />
          <ToggleRow label="Lost & Found matches" description="Get notified about new posts that might match your item." />
          <ToggleRow label="Campus announcements" description="Get notified when your university publishes a new announcement." defaultChecked={false} />
        </div>

        <div className="card">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={17} /> Security
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Password changes aren&rsquo;t wired up in this prototype yet — this will be handled by Supabase Auth.
          </p>
          <Button variant="secondary" disabled>Change password</Button>
        </div>

        <div className="card" style={{ borderColor: '#f0d3d6' }}>
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)' }}>
            <Trash2 size={17} /> Danger zone
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Deleting your account removes your demo reports and posts from this browser.
          </p>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete demo data</Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          showToast('This is a prototype — account deletion is disabled for the demo.', { type: 'info' });
        }}
        title="Delete demo data?"
        description="This would permanently remove your reports and posts in a production build. In this prototype, nothing will actually be deleted."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
