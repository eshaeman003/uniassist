import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, EyeOff, User, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getReportById, updateReportStatus } from '../../services/reportService';
import { REPORT_STATUSES, REPORT_PRIORITIES } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import ReportTimeline from '../../components/ReportTimeline';
import EmptyState from '../../components/EmptyState';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';

export default function AdminReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: '',
    priority: '',
    department: '',
    internalNote: '',
    publicUpdate: '',
  });

  useEffect(() => {
    const load = async () => {
      const r = await getReportById(id, true);
      setReport(r);
      if (r) {
        setForm({
          status: r.status,
          priority: r.priority,
          department: r.department || '',
          internalNote: r.internalNote || '',
          publicUpdate: r.publicUpdate || '',
        });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const updated = await updateReportStatus(id, {
      status: form.status,
      priority: form.priority,
      department: form.department,
      internalNote: form.internalNote,
      publicUpdate: form.publicUpdate,
    });
    setSaving(false);
    if (updated) {
      setReport(updated);
      showToast('Report updated.');
    } else {
      showToast('Update failed. Run the RLS policies in Supabase first.');
    }
  };

  if (loading) return null;

  if (!report) {
    return (
      <EmptyState
        title="Report not found"
        description="This report may have been removed, or the link is incorrect."
        action={
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/reports')}>
            Back to Reports
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

      <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start', gap: 24 }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>{report.id}</span>
                <h1 style={{ fontSize: '1.3rem', marginTop: 4 }}>{report.title}</h1>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="badge badge-neutral">{report.category}</span>
              <span className="badge badge-neutral">
                <MapPin size={11} /> {report.building}
                {report.location ? ` — ${report.location}` : ''}
              </span>
              <span className="badge badge-neutral">{report.priority} priority</span>
              {report.isAnonymous ? (
                <span className="badge badge-lilac"><EyeOff size={11} /> Anonymous</span>
              ) : (
                <span className="badge badge-neutral"><User size={11} /> Public</span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{report.description}</p>
          </div>

          <div className="card">
            <h3 className="section-title">Update report</h3>

            <div className="grid-2">
              <Field label="Status" htmlFor="r-status">
                <Select id="r-status" value={form.status} onChange={set('status')}>
                  {REPORT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Priority" htmlFor="r-priority">
                <Select id="r-priority" value={form.priority} onChange={set('priority')}>
                  {REPORT_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Assigned department" htmlFor="r-dept">
              <Input id="r-dept" placeholder="e.g. Facilities, Security, IT" value={form.department} onChange={set('department')} />
            </Field>

            <Field label="Public update (visible to student)" htmlFor="r-public">
              <Input id="r-public" placeholder="e.g. Technician assigned, visit scheduled tomorrow." value={form.publicUpdate} onChange={set('publicUpdate')} />
            </Field>

            <Field label="Internal note (admins only)" htmlFor="r-internal">
              <Input id="r-internal" placeholder="Internal remarks, not visible to students." value={form.internalNote} onChange={set('internalNote')} />
            </Field>

            <Button variant="primary" icon={Save} loading={saving} onClick={handleSave} style={{ marginTop: 8 }}>
              Save changes
            </Button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Status timeline</h3>
          <ReportTimeline report={report} />
        </div>
      </div>
    </div>
  );
}
