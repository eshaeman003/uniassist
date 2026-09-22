import { supabase } from '../lib/supabaseClient';

export async function getAnnouncementsForUniversity(universityId, { onlyPublished = true } = {}) {
  let query = supabase.from('announcements').select('*').eq('university_id', universityId).order('date', { ascending: false });
  if (onlyPublished) query = query.eq('published', true);

  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data.map(normalizeAnnouncement);
}

export async function getAnnouncementById(id) {
  const { data, error } = await supabase.from('announcements').select('*').eq('id', id).single();
  if (error) return null;
  return normalizeAnnouncement(data);
}

export async function createAnnouncement({ universityId, title, category, description, date, createdBy }) {
  const { data, error } = await supabase
    .from('announcements')
    .insert({ university_id: universityId, title, category, description, date, created_by: createdBy })
    .select()
    .single();

  if (error) { console.error(error); return null; }
  return normalizeAnnouncement(data);
}

export async function updateAnnouncement(id, patch) {
  const dbPatch = {};
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.date !== undefined) dbPatch.date = patch.date;
  if (patch.published !== undefined) dbPatch.published = patch.published;

  const { data, error } = await supabase.from('announcements').update(dbPatch).eq('id', id).select().single();
  if (error) return null;
  return normalizeAnnouncement(data);
}

export async function deleteAnnouncement(id) {
  await supabase.from('announcements').delete().eq('id', id);
}

function normalizeAnnouncement(a) {
  return {
    id: a.id,
    universityId: a.university_id,
    title: a.title,
    category: a.category,
    description: a.description,
    date: a.date,
    published: a.published,
  };
}

export function subscribeToAnnouncements(universityId, onChange) {
  const channel = supabase
    .channel(`announcements-${universityId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}