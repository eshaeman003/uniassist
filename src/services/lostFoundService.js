import { supabase } from '../lib/supabaseClient';

export async function getItemsForUniversity(universityId) {
  const { data, error } = await supabase
    .from('lost_found_items')
    .select('*')
    .eq('university_id', universityId)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return []; }
  return data.map(normalizeItem);
}

export async function getItemById(id) {
  const { data, error } = await supabase.from('lost_found_items').select('*').eq('id', id).single();
  if (error) return null;
  return normalizeItem(data);
}

export async function createItem({ universityId, userId, type, title, category, description, location, date, imageDataUrl }) {
  let imageUrl = null;

  if (imageDataUrl) {
    const blob = await (await fetch(imageDataUrl)).blob();
    const fileName = `${universityId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from('lostfound-photos').upload(fileName, blob);
    if (!uploadError) {
      imageUrl = supabase.storage.from('lostfound-photos').getPublicUrl(fileName).data.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from('lost_found_items')
    .insert({
      university_id: universityId,
      user_id: userId,
      type,
      title,
      category,
      description,
      location,
      date,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) { console.error(error); return null; }
  return normalizeItem(data);
}

export async function updateItemStatus(id, status) {
  const { data, error } = await supabase.from('lost_found_items').update({ status }).eq('id', id).select().single();
  if (error) return null;
  return normalizeItem(data);
}

export async function removeItem(id) {
  await supabase.from('lost_found_items').delete().eq('id', id);
}

function normalizeItem(i) {
  return {
    id: i.id,
    universityId: i.university_id,
    userId: i.user_id,
    type: i.type,
    title: i.title,
    category: i.category,
    description: i.description,
    location: i.location,
    date: i.date,
    imageDataUrl: i.image_url,
    status: i.status,
    createdAt: i.created_at,
  };
}

export function subscribeToLostFound(universityId, onChange) {
  const channel = supabase
    .channel(`lostfound-${universityId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_found_items' }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}