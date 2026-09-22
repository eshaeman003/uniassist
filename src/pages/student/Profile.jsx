import { useState } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as authService from '../../services/authService';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { initials } from '../../utils/format';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = await authService.updateCurrentUser({ name });
    setSaving(false);
    if (updated) {
      await refreshUser();
      showToast('Profile updated.');
    } else {
      showToast('Could not update profile.', { type: 'error' });
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p>Your account information for {user.university?.shortName}.</p>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.5fr', alignItems: 'start', gap: 24, maxWidth: 780 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="app-user-avatar" style={{ width: 72, height: 72, fontSize: '1.4rem', margin: '0 auto 14px' }}>
            {initials(user.name)}
          </div>
          <h3 style={{ fontSize: '1.05rem' }}>{user.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{user.role === 'admin' ? 'University Administrator' : 'Student'}</p>
          <div style={{ marginTop: 14 }}>
            <span className="university-badge">
              <span className="university-badge-mark">{user.university?.shortName?.slice(0, 3)}</span>
              {user.university?.name}
            </span>
          </div>
        </div>

        <form className="card" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full name" htmlFor="profile-name">
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} icon={User} />
          </Field>
          <Field label="University email" htmlFor="profile-email" hint="Contact your university administrator to change your registered email.">
            <Input id="profile-email" value={user.email} disabled />
          </Field>
          {user.studentId && (
            <Field label="University registration number" htmlFor="profile-studentid">
              <Input id="profile-studentid" value={user.studentId} disabled />
            </Field>
          )}
          <Button type="submit" variant="primary" loading={saving} icon={Save} style={{ alignSelf: 'flex-start' }}>
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}