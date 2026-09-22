import { supabase } from '../lib/supabaseClient';

export async function getUniversities() {
  const { data, error } = await supabase.from('universities').select('*').order('name');
  if (error) { console.error(error); return []; }
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    shortName: u.short_name,
    city: u.city,
    country: u.country,
    emailDomain: u.email_domain,
    website: u.website,
  }));
}

export async function getUniversityById(id) {
  const { data, error } = await supabase.from('universities').select('*').eq('id', id).single();
  if (error) return null;
  return { id: data.id, name: data.name, shortName: data.short_name, city: data.city, emailDomain: data.email_domain };
}

export async function getStudentsForUniversity(universityId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('university_id', universityId)
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return []; }
  return data.map((s) => ({
    id: s.id,
    name: s.name,
    studentId: s.student_id || '—',
    universityId: s.university_id,
    email: s.email,
    createdAt: s.created_at,
    status: s.status,
  }));
}

export const DEFAULT_UNIVERSITY_ID = 'cust';