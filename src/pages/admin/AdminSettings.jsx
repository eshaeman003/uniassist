import { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabaseClient';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function AdminSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user.university?.name || '');
  const [city, setCity] = useState(user.university?.city || '');
  const [domain, setDomain] = useState(user.university?.emailDomain || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('universities')
      .update({ name, city, email_domain: domain })
      .eq('id', user.universityId);
    setSaving(false);
    if (!error) {
      showToast('University settings saved.');
    } else {
      showToast('Could not save settings.', { type: 'error' });
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>University Settings</h1>
          <p>Manage how {user.university?.shortName} appears on UniAssist.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSave} style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="university-badge" style={{ alignSelf: 'flex-start', marginBottom: 4 }}>
          <span className="university-badge-mark"><Building2 size={14} /></span>
          {user.university?.shortName}
        </div>

        <Field label="University name" htmlFor="settings-name">
          <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="City" htmlFor="settings-city">
          <Input id="settings-city" value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="Student email domain" htmlFor="settings-domain" hint="Used to validate student registrations for this university.">
          <Input id="settings-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </Field>

        <Button type="submit" variant="primary" loading={saving} icon={Save} style={{ alignSelf: 'flex-start' }}>
          Save changes
        </Button>
      </form>
    </div>
  );
}