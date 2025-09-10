import { supabase } from './supabase';
import type { Insight } from './types';

// Bookmark an insight
export async function bookmarkInsight(insightId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('user_insight_bookmarks').insert({
    user_id: user.id,
    insight_id: insightId,
  });

  if (error) throw error;
}

// Remove bookmark from an insight
export async function unbookmarkInsight(insightId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_insight_bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('insight_id', insightId);

  if (error) throw error;
}

// Get all bookmarked insights for the current user
export async function getBookmarkedInsights(): Promise<Insight[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_insight_bookmarks')
    .select(
      `
      insight:insights(*)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data?.map(item => item.insight as unknown as Insight) || []).filter(
    Boolean
  );
}

// Check if an insight is bookmarked
export async function isInsightBookmarked(insightId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_insight_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('insight_id', insightId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return !!data;
}

// Get bookmark status for multiple insights
export async function getBookmarkStatus(
  insightIds: string[]
): Promise<{ [key: string]: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from('user_insight_bookmarks')
    .select('insight_id')
    .eq('user_id', user.id)
    .in('insight_id', insightIds);

  if (error) throw error;

  const status: { [key: string]: boolean } = {};
  insightIds.forEach(id => {
    status[id] = data?.some(item => item.insight_id === id) || false;
  });

  return status;
}
