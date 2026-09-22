import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createItem } from '../../services/lostFoundService';
import { LOST_FOUND_CATEGORIES } from '../../data/mockData';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import FileUpload from '../../components/FileUpload';

export default function LostFoundNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') === 'Found' ? 'Found' : 'Lost';

  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Enter the item name.';
    if (!category) next.category = 'Select a category.';
    if (!description.trim()) next.description = 'Add a short description.';
    if (!location.trim()) next.location = 'Enter a location.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const item = await createItem({
      universityId: user.universityId,
      userId: user.id,
      type,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      date: new Date(date).toISOString(),
      imageDataUrl: files[0]?.dataUrl || null,
    });
    setSubmitting(false);
    if (!item) {
      return;
    }
    setCreated(item);
  };

  if (created) {
    return (
      <div className="success-shell" style={{ minHeight: '60vh' }}>
        <div className="card success-card">
          <div className="success-icon-wrap"><CheckCircle2 size={30} /></div>
          <h1>Your {created.type.toLowerCase()} item has been posted.</h1>
          <p>Other students on your campus can now see it in Lost &amp; Found.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="secondary" block onClick={() => navigate('/app/lost-found')}>Back to Lost & Found</Button>
            <Button variant="primary" block onClick={() => navigate(`/app/lost-found/${created.id}`)}>View Post</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Post an item</h1>
          <p>Let your campus know about something lost or found.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Lost or Found">
            <div className="role-switch" role="tablist">
              <button type="button" role="tab" aria-selected={type === 'Lost'} className={type === 'Lost' ? 'active' : ''} onClick={() => setType('Lost')}>I lost something</button>
              <button type="button" role="tab" aria-selected={type === 'Found'} className={type === 'Found' ? 'active' : ''} onClick={() => setType('Found')}>I found something</button>
            </div>
          </Field>

          <Field label="Item name" htmlFor="lf-title" error={errors.title}>
            <Input id="lf-title" placeholder="e.g. Black Wallet" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
          </Field>

          <Field label="Category" htmlFor="lf-category" error={errors.category}>
            <Select id="lf-category" value={category} onChange={(e) => setCategory(e.target.value)} error={errors.category}>
              <option value="">Select a category</option>
              {LOST_FOUND_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>

          <Field label="Description" htmlFor="lf-description" error={errors.description}>
            <Textarea id="lf-description" placeholder="Describe the item, any identifying details..." value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
          </Field>

          <div className="grid-2">
            <Field label="Location" htmlFor="lf-location" error={errors.location}>
              <Input id="lf-location" placeholder="Library" value={location} onChange={(e) => setLocation(e.target.value)} error={errors.location} />
            </Field>
            <Field label="Date" htmlFor="lf-date">
              <Input id="lf-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>

          <Field label="Photo" optional>
            <FileUpload files={files} onChange={setFiles} multiple={false} />
          </Field>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={submitting} icon={Send} style={{ marginTop: 20 }}>
          Post Item
        </Button>
      </form>
    </div>
  );
}