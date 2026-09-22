import { useEffect, useState } from 'react';
import { Megaphone, Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getAnnouncementsForUniversity, createAnnouncement, updateAnnouncement, deleteAnnouncement, subscribeToAnnouncements,
} from '../../services/announcementService';
import { useToast } from '../../context/ToastContext';
import { ANNOUNCEMENT_CATEGORIES } from '../../data/mockData';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/format';

const emptyForm = { title: '', category: 'General', description: '', date: new Date().toISOString().slice(0, 10) };

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    const data = await getAnnouncementsForUniversity(user.universityId, { onlyPublished: false });
    setAnnouncements(data);
  };

  useEffect(() => {
    load();
    const unsub = subscribeToAnnouncements(user.universityId, load);
    return unsub;
  }, [user.universityId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, category: a.category, description: a.description, date: a.date.slice(0, 10) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    if (editing) {
      await updateAnnouncement(editing.id, { ...form, date: new Date(form.date).toISOString() });
      showToast('Announcement updated.');
    } else {
      await createAnnouncement({ universityId: user.universityId, ...form, date: new Date(form.date).toISOString(), createdBy: user.id });
      showToast('Announcement published.');
    }
    setModalOpen(false);
  };

  const togglePublish = async (a) => {
    await updateAnnouncement(a.id, { published: !a.published });
    showToast(a.published ? 'Announcement unpublished.' : 'Announcement published.');
  };

  const handleDeleteConfirmed = async () => {
    if (toDelete) {
      await deleteAnnouncement(toDelete.id);
      showToast('Announcement deleted.');
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Announcements</h1>
          <p>Publish updates and notices to {user.university?.shortName} students.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreate}>New announcement</Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet." description="Create your first announcement to keep students informed." action={<Button variant="primary" size="sm" onClick={openCreate}>New announcement</Button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 780 }}>
          {announcements.map((a) => (
            <div className="card announcement-card" key={a.id}>
              <div className="announcement-card-top">
                <h4>{a.title}</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-lilac">{a.category}</span>
                  <span className={`badge ${a.published ? 'badge-success' : 'badge-neutral'}`}>{a.published ? 'Published' : 'Unpublished'}</span>
                </div>
              </div>
              <p>{a.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span className="announcement-date">{formatDate(a.date)}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="ghost" size="sm" icon={a.published ? EyeOff : Eye} onClick={() => togglePublish(a)}>
                    {a.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button variant="ghost" size="sm" icon={Pencil} onClick={() => openEdit(a)}>Edit</Button>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => setToDelete(a)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit announcement' : 'New announcement'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Save changes' : 'Publish'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Title" htmlFor="an-title">
            <Input id="an-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Category" htmlFor="an-category">
            <Select id="an-category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {ANNOUNCEMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Description" htmlFor="an-description">
            <Textarea id="an-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Date" htmlFor="an-date">
            <Input id="an-date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirmed}
        title="Delete this announcement?"
        description={`"${toDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}