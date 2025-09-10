import { supabase } from './supabase';
import type { Insight } from './types';

// Get all insights
export async function getInsights(): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get insights by category
export async function getInsightsByCategory(
  category: string
): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get insights by age range
export async function getInsightsByAgeRange(
  ageRange: string
): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .or(`age_range.eq.${ageRange},age_range.eq.all`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get insights relevant to user's kids
export async function getRelevantInsights(): Promise<Insight[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's kids to determine relevant age ranges
  const { data: kids } = await supabase
    .from('kids')
    .select('age')
    .eq('user_id', user.id);

  if (!kids || kids.length === 0) {
    // Return general insights if no kids
    return getInsightsByAgeRange('all');
  }

  const ages = kids.map(kid => kid.age);
  const ageRanges = new Set<string>();

  // Determine age ranges based on kids' ages
  ages.forEach(age => {
    if (age >= 4 && age <= 6) ageRanges.add('4-6');
    if (age >= 7 && age <= 8) ageRanges.add('7-8');
    if (age >= 9 && age <= 10) ageRanges.add('9-10');
  });

  // Get insights for relevant age ranges plus general ones
  const ageRangeArray = Array.from(ageRanges);
  ageRangeArray.push('all');

  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .in('age_range', ageRangeArray)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get a random insight
export async function getRandomInsight(): Promise<Insight | null> {
  const insights = await getRelevantInsights();
  if (insights.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * insights.length);
  return insights[randomIndex];
}
