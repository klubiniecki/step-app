import { supabase } from './supabase';
import type { UserStreak } from './types';

// Get user's streak data
export async function getUserStreak(): Promise<UserStreak | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
}

// Get or create user streak (called when user completes first activity)
export async function getOrCreateUserStreak(): Promise<UserStreak> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let streak = await getUserStreak();

  if (!streak) {
    const { data, error } = await supabase
      .from('user_streaks')
      .insert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        total_activities: 0,
      })
      .select()
      .single();

    if (error) throw error;
    streak = data;
  }

  if (!streak) {
    throw new Error('Failed to create user streak');
  }

  return streak;
}

// Get streak statistics
export async function getStreakStats(): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalActivities: number;
  daysSinceLastActivity: number | null;
}> {
  const streak = await getUserStreak();

  if (!streak) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActivities: 0,
      daysSinceLastActivity: null,
    };
  }

  const daysSinceLastActivity = streak.last_activity_date
    ? Math.floor(
        (Date.now() - new Date(streak.last_activity_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    currentStreak: streak.current_streak,
    longestStreak: streak.longest_streak,
    totalActivities: streak.total_activities,
    daysSinceLastActivity,
  };
}

// Check if user has completed activity today
export async function hasCompletedActivityToday(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const today = new Date().toISOString().split('T')[0];

  // Count distinct activities completed today (not individual kid entries)
  const { data, error } = await supabase
    .from('user_activities')
    .select('activity_id')
    .eq('user_id', user.id)
    .gte('completed_at', `${today}T00:00:00`)
    .lt('completed_at', `${today}T23:59:59`)
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

// Get weekly activity completion
export async function getWeeklyActivityCompletion(): Promise<{
  [key: string]: boolean; // date string -> completed
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get distinct activities per day (not individual kid entries)
  const { data, error } = await supabase
    .from('user_activities')
    .select('completed_at, activity_id')
    .eq('user_id', user.id)
    .gte('completed_at', weekAgo.toISOString())
    .order('completed_at', { ascending: true });

  if (error) throw error;

  const completion: { [key: string]: boolean } = {};

  // Initialize all days as false
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    completion[dateStr] = false;
  }

  // Track unique activities per day
  const activitiesPerDay: { [key: string]: Set<string> } = {};

  // Group activities by date
  data?.forEach(activity => {
    const activityDate = new Date(activity.completed_at);
    const dateStr = activityDate.toISOString().split('T')[0];

    if (completion.hasOwnProperty(dateStr)) {
      if (!activitiesPerDay[dateStr]) {
        activitiesPerDay[dateStr] = new Set();
      }
      activitiesPerDay[dateStr].add(activity.activity_id);
    }
  });

  // Mark days as completed if they have at least one unique activity
  Object.keys(completion).forEach(dateStr => {
    if (activitiesPerDay[dateStr] && activitiesPerDay[dateStr].size > 0) {
      completion[dateStr] = true;
    }
  });

  return completion;
}
