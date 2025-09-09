import { supabase } from './supabase';

export type Kid = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  created_at: string;
};

export async function listKids(): Promise<Kid[]> {
  const { data, error } = await supabase
    .from('kids')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createKid(name: string, age: number): Promise<Kid> {
  // Enforce max 3 kids per user client-side (RLS should also enforce)
  const { count, error: countErr } = await supabase
    .from('kids')
    .select('id', { count: 'exact', head: true });
  if (countErr) throw countErr;
  if ((count ?? 0) >= 3) {
    throw new Error('You can only add up to 3 kids.');
  }
  const { data, error } = await supabase
    .from('kids')
    .insert({ name, age })
    .select('*')
    .single();
  if (error) throw error;
  return data as Kid;
}

export async function updateKid(
  id: string,
  updates: Partial<Pick<Kid, 'name' | 'age'>>
): Promise<Kid> {
  const { data, error } = await supabase
    .from('kids')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Kid;
}

export async function deleteKid(id: string): Promise<void> {
  const { error } = await supabase.from('kids').delete().eq('id', id);
  if (error) throw error;
}
