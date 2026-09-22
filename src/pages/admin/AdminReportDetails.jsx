import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, EyeOff, User, MapPin, Save } from 'lucide-react';
import { getReportById, updateReportStatus } from '../../services/reportService';
import { onStorageChange } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { REPORT_STATUSES, REPORT_PRIORITIES } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import ReportTimeline from '../../components/ReportTimeline';
import EmptyState from '../../components/EmptyState';
import Field from '../../components/Field';
import Select from '../../components/Select';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';

export default function AdminReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [report, setReport] = useState(() => getReportById(id));

  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [publicUpdate, setPublicUpdate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const r = getReportById(id);
    setReport(r);
    if (r) {
      setStatus(r.status);
      setPriority(r.priority);
      setDepartment(r.department || '');
      setInternalNote(r.internalNote || '');
      setPublicUpdate(r.publicUpdate || '');
    }
    return onStorageChange(() => {
      const fresh = getReportById(id);
      setReport(fresh);
    });
  }, [id]);

  if (!report) {
    return (
      <EmptyState
        title="Report not found"
        description="This report may have been removed, or the link is incorrect."
        action={<Link to="/admin/reports" className="btn btn-primary btn-sm">Back to Reports</Link>}
      />
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateReportStatus(report.id, {
        status,
        priority,
        department,
        internalNote,
        publicUpdate,
        note: publicUpdate || undefined,
      });
      setSaving(false);
      showToast('Report updated. The student will see the new status.');
    }, 400);
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18, paddingLeft: 4 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>{report.id}</span>
                <h1 style={{ fontSize: '1.3rem', marginTop: 4 }}>{report.title}</h1>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="badge badge-neutral">{report.category}</span>
              <span className="badge badge-neutral"><MapPin size={11} /> {report.building}{report.location ? ` — ${report.location}` : ''}</span>
              {report.isAnonymous ? (
                <span className="badge badge-lilac"><EyeOff size={11} /> Anonymous Student</span>
              ) : (
                <span className="badge badge-neutral"><User size={11} /> Reported publicly</span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{report.description}</p>
          </div>

          <form className="card" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Manage report</h3>

            <div className="grid-2">
              <Field label="Status" htmlFor="admin-status">
                <Select id="admin-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {REPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Priority" htmlFor="admin-priority">
                <Select id="admin-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  {REPORT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Assigned department" htmlFor="admin-department" optional>
              <Input id="admin-department" placeholder="e.g. Facilities Management" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </Field>

            <Field label="Internal note" htmlFor="admin-internal" optional hint="Only visible to university staff.">
              <Textarea id="admin-internal" placeholder="Internal notes for your team..." value={internalNote} onChange={(e) => setInternalNote(e.target.value)} />
            </Field>

            <Field label="Public update" htmlFor="admin-public" optional hint="This will be shown to the student and added to the timeline when you change status.">
              <Textarea id="admin-public" placeholder="e.g. Maintenance has been notified and is investigating." value={publicUpdate} onChange={(e) => setPublicUpdate(e.target.value)} />
            </Field>

            <Button type="submit" variant="primary" loading={saving} icon={Save} style={{ alignSelf: 'flex-start' }}>
              Save update
            </Button>
          </form>
        </div>

        <div className="card">
          <h3 className="section-title">Status timeline</h3>
          <ReportTimeline report={report} />
        </div>
      </div>
    </div>
  );
}
