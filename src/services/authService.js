// Supabase-backed authentication service.
import { supabase } from '../lib/supabaseClient';

export function isEmailDomainValid(email, universities, universityId) {
  const uni = universities.find((u) => u.id === universityId);
  if (!uni || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return domain === uni.emailDomain.toLowerCase();
}

/** Student self-registration. Returns { ok, user, error }. */
export async function registerStudent({ universityId, name, studentId, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'student', university_id: universityId, name, student_id: studentId },
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}

/** University onboarding — creates a university row + an admin account. */
export async function registerUniversity(payload) {
  const universityId = `${payload.universityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}-${Date.now().toString().slice(-4)}`;

  const { error: uniError } = await supabase.from('universities').insert({
    id: universityId,
    name: payload.universityName,
    short_name: payload.universityName.split(' ').map((w) => w[0]).join('').slice(0, 5).toUpperCase(),
    city: payload.city,
    country: payload.country,
    website: payload.website,
    email_domain: payload.adminEmail.split('@')[1] || '',
    status: 'Pending verification',
  });

  if (uniError) return { ok: false, error: uniError.message };

  const { data, error } = await supabase.auth.signUp({
    email: payload.adminEmail,
    password: payload.password,
    options: {
      data: { role: 'admin', university_id: universityId, name: payload.adminName },
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}

export async function loginAsDemoStudent() {
  return login({ email: 'esha.demo@cust.edu.pk', password: 'Demo1234' });
}

export async function loginAsDemoAdmin() {
  return login({ email: 'admin.demo@cust.edu.pk', password: 'Demo1234' });
}

export async function logout() {
  await supabase.auth.signOut();
}

/** Fetch current session + matching profile row (role, university, etc). */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, university:universities(*)')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) return null;

  return {
    id: profile.id,
    role: profile.role,
    universityId: profile.university_id,
    name: profile.name,
    studentId: profile.student_id,
    email: profile.email,
    status: profile.status,
    university: profile.university
      ? {
          id: profile.university.id,
          name: profile.university.name,
          shortName: profile.university.short_name,
          city: profile.university.city,
          emailDomain: profile.university.email_domain,
        }
      : null,
  };
}

export async function updateCurrentUser(patch) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const dbPatch = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;

  const { data, error } = await supabase
    .from('profiles')
    .update(dbPatch)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) return null;
  return data;
}