import { supabase } from './supabase';
import type {
  Activity,
  ActivityFilters,
  ActivityRecommendation,
  DailyActivity,
  UserActivity,
} from './types';

// Get activities with optional filters
export async function getActivities(
  filters: ActivityFilters = {}
): Promise<Activity[]> {
  let query = supabase.from('activities').select('*');

  if (filters.age_min !== undefined) {
    query = query.gte('age_min', filters.age_min);
  }
  if (filters.age_max !== undefined) {
    query = query.lte('age_max', filters.age_max);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.difficulty_level) {
    query = query.eq('difficulty_level', filters.difficulty_level);
  }
  if (filters.duration_max) {
    query = query.lte('duration_minutes', filters.duration_max);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Get a single activity by ID
export async function getActivity(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get today's recommended activity
export async function getTodaysActivity(): Promise<DailyActivity | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's kids to determine age range
  const { data: kids } = await supabase
    .from('kids')
    .select('age')
    .eq('user_id', user.id);

  if (!kids || kids.length === 0) return null;

  const ages = kids.map(kid => kid.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  // Get user's completed activities today
  const today = new Date().toISOString().split('T')[0];
  const { data: completedToday } = await supabase
    .from('user_activities')
    .select('activity_id')
    .eq('user_id', user.id)
    .gte('completed_at', `${today}T00:00:00`)
    .lt('completed_at', `${today}T23:59:59`);

  const completedIds = completedToday?.map(ua => ua.activity_id) || [];

  // Get user's streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single();

  // Find a suitable activity
  let query = supabase
    .from('activities')
    .select('*')
    .gte('age_min', minAge)
    .lte('age_max', maxAge);

  if (completedIds.length > 0) {
    query = query.not('id', 'in', `(${completedIds.join(',')})`);
  }

  const { data: activities, error } = await query.limit(1).single();

  if (error || !activities) return null;

  return {
    activity: activities,
    is_completed: false,
    streak_count: streak?.current_streak || 0,
  };
}

// Complete an activity
export async function completeActivity(
  activityId: string,
  kidId: string | null,
  rating: number,
  notes?: string,
  durationActual?: number
): Promise<UserActivity> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_activities')
    .insert({
      user_id: user.id,
      activity_id: activityId,
      kid_id: kidId,
      rating,
      notes,
      duration_actual: durationActual,
    })
    .select(
      `
      *,
      activity:activities(*),
      kid:kids(id, name, age)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

// Get user's activity history
export async function getUserActivities(limit = 20): Promise<UserActivity[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_activities')
    .select(
      `
      *,
      activity:activities(*),
      kid:kids(id, name, age)
    `
    )
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Get activity recommendations based on user preferences and history
export async function getActivityRecommendations(
  limit = 5
): Promise<ActivityRecommendation[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's kids
  const { data: kids } = await supabase
    .from('kids')
    .select('age')
    .eq('user_id', user.id);

  if (!kids || kids.length === 0) return [];

  const ages = kids.map(kid => kid.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  // Get user's preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('preferred_categories, preferred_difficulty')
    .eq('user_id', user.id)
    .single();

  // Get user's completed activities to avoid repeats
  const { data: completedActivities } = await supabase
    .from('user_activities')
    .select('activity_id')
    .eq('user_id', user.id);

  const completedIds = completedActivities?.map(ua => ua.activity_id) || [];

  // Build recommendation query
  let query = supabase
    .from('activities')
    .select('*')
    .gte('age_min', minAge)
    .lte('age_max', maxAge);

  if (completedIds.length > 0) {
    query = query.not('id', 'in', `(${completedIds.join(',')})`);
  }

  if (preferences?.preferred_categories?.length > 0) {
    query = query.in('category', preferences.preferred_categories);
  }

  if (preferences?.preferred_difficulty) {
    query = query.eq('difficulty_level', preferences.preferred_difficulty);
  }

  const { data: activities, error } = await query.limit(limit);

  if (error) throw error;

  // Convert to recommendations with match scores
  return (activities || []).map(activity => ({
    activity,
    reason: getRecommendationReason(activity, preferences),
    match_score: calculateMatchScore(activity, preferences, minAge, maxAge),
  }));
}

function getRecommendationReason(
  activity: Activity,
  preferences: unknown
): string {
  const prefs = preferences as {
    preferred_categories?: string[];
    preferred_difficulty?: number;
  } | null;
  if (prefs?.preferred_categories?.includes(activity.category)) {
    return `Matches your interest in ${activity.category} activities`;
  }
  if (prefs?.preferred_difficulty === activity.difficulty_level) {
    return `Perfect difficulty level for you`;
  }
  return `Great for ages ${activity.age_min}-${activity.age_max}`;
}

function calculateMatchScore(
  activity: Activity,
  preferences: unknown,
  minAge: number,
  maxAge: number
): number {
  let score = 0.5; // Base score
  const prefs = preferences as {
    preferred_categories?: string[];
    preferred_difficulty?: number;
  } | null;

  // Age match
  if (activity.age_min <= minAge && activity.age_max >= maxAge) {
    score += 0.3;
  }

  // Category preference
  if (prefs?.preferred_categories?.includes(activity.category)) {
    score += 0.2;
  }

  // Difficulty preference
  if (prefs?.preferred_difficulty === activity.difficulty_level) {
    score += 0.2;
  }

  return Math.min(score, 1.0);
}
