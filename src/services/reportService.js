import { supabase } from '../lib/supabaseClient';

export async function getReportsForUser(userId) {
  const { data, error } = await supabase
    .from('reports')
    .select('*, timeline:report_timeline(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return []; }
  return data.map(normalizeReport);
}

export async function getReportsForUniversity(universityId) {
  const { data, error } = await supabase
    .from('reports_admin_safe')
    .select('*, timeline:report_timeline(*)')
    .eq('university_id', universityId)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return []; }
  return data.map(normalizeReport);
}

export async function getReportById(id, isAdmin = false) {
  const table = isAdmin ? 'reports_admin_safe' : 'reports';
  const { data, error } = await supabase
    .from(table)
    .select('*, timeline:report_timeline(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return normalizeReport(data);
}

export async function createReport({ universityId, userId, title, description, category, building, location, priority, isAnonymous }) {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      university_id: universityId,
      user_id: userId,
      title,
      description,
      category,
      building,
      location,
      priority,
      is_anonymous: isAnonymous,
    })
    .select('*, timeline:report_timeline(*)')
    .single();

  if (error) { console.error(error); return null; }
  return normalizeReport(data);
}

export async function updateReportStatus(id, { status, department, priority, internalNote, publicUpdate }) {
  const patch = {};
  if (status !== undefined) patch.status = status;
  if (department !== undefined) patch.department = department;
  if (priority !== undefined) patch.priority = priority;
  if (internalNote !== undefined) patch.internal_note = internalNote;
  if (publicUpdate !== undefined) patch.public_update = publicUpdate;

  const { data, error } = await supabase
    .from('reports')
    .update(patch)
    .eq('id', id)
    .select('*, timeline:report_timeline(*)')
    .single();

  if (error) { console.error(error); return null; }
  return normalizeReport(data);
}

export function reportStats(reports) {
  return {
    total: reports.length,
    open: reports.filter((r) => r.status !== 'Resolved').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length,
    underReview: reports.filter((r) => r.status === 'Under Review').length,
    submitted: reports.filter((r) => r.status === 'Submitted').length,
  };
}

function normalizeReport(r) {
  return {
    id: r.id,
    universityId: r.university_id,
    userId: r.user_id,
    title: r.title,
    description: r.description,
    category: r.category,
    building: r.building,
    location: r.location,
    status: r.status,
    priority: r.priority,
    isAnonymous: r.is_anonymous,
    department: r.department,
    internalNote: r.internal_note,
    publicUpdate: r.public_update,
    createdAt: r.created_at,
    timeline: (r.timeline || [])
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((t) => ({ status: t.status, date: t.date, note: t.note })),
  };
}

/** Realtime: call this in a useEffect to re-run `onChange` whenever reports change for this university/user. */
export function subscribeToReports({ universityId, userId }, onChange) {
  const channel = supabase
    .channel(`reports-${universityId || userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'report_timeline' }, onChange)
    .subscribe();

  return () => supabase.removeChannel(channel);
}