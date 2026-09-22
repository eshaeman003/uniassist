import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createReport } from '../../services/reportService';
import { REPORT_CATEGORIES, REPORT_PRIORITIES } from '../../data/mockData';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import FileUpload from '../../components/FileUpload';

const initialForm = {
  category: '',
  building: '',
  location: '',
  description: '',
  priority: 'Medium',
  isAnonymous: true,
};

export default function ReportNew() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Give your report a short title.';
    if (!form.category) next.category = 'Select a problem type.';
    if (!form.building.trim()) next.building = 'Enter the building.';
    if (!form.description.trim() || form.description.trim().length < 10) next.description = 'Describe what happened (at least 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const report = await createReport({
      universityId: user.universityId,
      userId: user.id,
      title: title.trim(),
      description: form.description.trim(),
      category: form.category,
      building: form.building.trim(),
      location: form.location.trim(),
      priority: form.priority,
      isAnonymous: form.isAnonymous,
    });
    setSubmitting(false);
    if (!report) {
      showToast('Something went wrong submitting your report. Please try again.', { type: 'error' });
      return;
    }
    setCreated(report);
  };

  if (created) {
    return (
      <div className="success-shell" style={{ minHeight: '60vh' }}>
        <div className="card success-card">
          <div className="success-icon-wrap"><CheckCircle2 size={30} /></div>
          <h1>Your report has been submitted safely.</h1>
          <p>Reference ID</p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--lilac-dark)', letterSpacing: '0.02em' }}>{created.id}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="secondary" block onClick={() => navigate('/app')}>Back to Dashboard</Button>
            <Button variant="primary" block onClick={() => navigate(`/app/reports/${created.id}`)}>Track Report</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Report a campus problem</h1>
          <p>Help your university identify and resolve issues faster.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Report title" htmlFor="report-title" error={errors.title}>
            <Input id="report-title" placeholder="e.g. Broken AC in Lab 3" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
          </Field>

          <Field label="What type of problem is this?" htmlFor="report-category" error={errors.category}>
            <Select id="report-category" value={form.category} onChange={set('category')} error={errors.category}>
              <option value="">Select a category</option>
              {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>

          <div className="grid-2">
            <Field label="Building" htmlFor="report-building" error={errors.building}>
              <Input id="report-building" placeholder="Engineering Block" value={form.building} onChange={set('building')} error={errors.building} />
            </Field>
            <Field label="Location" htmlFor="report-location" optional>
              <Input id="report-location" placeholder="Lab 3" value={form.location} onChange={set('location')} />
            </Field>
          </div>

          <Field label="What happened?" htmlFor="report-description" error={errors.description}>
            <Textarea id="report-description" placeholder="Describe the problem in as much detail as you can..." value={form.description} onChange={set('description')} error={errors.description} />
          </Field>

          <Field label="Add photos" optional>
            <FileUpload files={files} onChange={setFiles} />
          </Field>

          <Field label="Priority" htmlFor="report-priority">
            <Select id="report-priority" value={form.priority} onChange={set('priority')}>
              {REPORT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>
        </div>

        <div className="privacy-card">
          <div className="privacy-card-icon"><ShieldCheck size={18} /></div>
          <div className="privacy-card-body">
            <h4>Protect your identity</h4>
            <p>
              You can submit this report anonymously. Your name and student information will not be displayed to
              university staff. If you are reporting something sensitive — such as harassment or assault — turning
              this on means staff only see what's needed to act on your report, not who filed it.
            </p>
            <div className="toggle-row">
              <span className="toggle-label">Submit anonymously</span>
              <label className="switch">
                <input type="checkbox" checked={form.isAnonymous} onChange={set('isAnonymous')} aria-label="Submit anonymously" />
                <span className="switch-track" />
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={submitting} icon={Send}>
          Submit Report
        </Button>
      </form>
    </div>
  );
}