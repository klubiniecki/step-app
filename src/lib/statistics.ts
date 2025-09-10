import { supabase } from './supabase';
import type {
  Activity,
  ChildActivityStats,
  ParentActivityStats,
} from './types';

// Get child activity statistics
export async function getChildActivityStats(): Promise<ChildActivityStats[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get all kids for the user
  const { data: kids, error: kidsError } = await supabase
    .from('kids')
    .select('id, name, age')
    .eq('user_id', user.id);

  if (kidsError) throw kidsError;
  if (!kids || kids.length === 0) return [];

  // Get statistics for each kid
  const statsPromises = kids.map(async kid => {
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select(
        `
        activity_id,
        activity:activities(*),
        child_rating,
        completed_at
      `
      )
      .eq('user_id', user.id)
      .eq('kid_id', kid.id)
      .not('child_rating', 'is', null)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    const activitiesData = activities || [];
    // Count unique activities, not individual kid entries
    const uniqueActivities = new Set(
      activitiesData.map(item => item.activity_id)
    );
    const totalActivities = uniqueActivities.size;

    // Calculate average rating for unique activities only
    const uniqueActivityRatings = new Map();
    activitiesData.forEach(item => {
      if (!uniqueActivityRatings.has(item.activity_id)) {
        uniqueActivityRatings.set(item.activity_id, item.child_rating || 0);
      }
    });

    const totalRating = Array.from(uniqueActivityRatings.values()).reduce(
      (sum, rating) => sum + rating,
      0
    );
    const averageRating =
      totalActivities > 0 ? totalRating / totalActivities : 0;

    // Get favorite activities (rated 5)
    const favoriteActivities = activitiesData
      .filter(item => item.child_rating === 5)
      .slice(0, 3) // Top 3 favorites
      .map(item => ({
        activity: item.activity as unknown as Activity,
        rating: item.child_rating || 0,
        completed_at: item.completed_at,
      }));

    return {
      kid_id: kid.id,
      kid_name: kid.name,
      kid_age: kid.age,
      total_activities: totalActivities,
      favorite_activities: favoriteActivities,
      average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    };
  });

  return Promise.all(statsPromises);
}

// Get parent activity statistics
export async function getParentActivityStats(): Promise<ParentActivityStats> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      total_activities: 0,
      favorite_activities: [],
      average_rating: 0,
    };

  const { data: activities, error } = await supabase
    .from('user_activities')
    .select(
      `
      activity_id,
      activity:activities(*),
      parent_rating,
      completed_at
    `
    )
    .eq('user_id', user.id)
    .not('parent_rating', 'is', null)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  const activitiesData = activities || [];
  // Count unique activities, not individual kid entries
  const uniqueActivities = new Set(
    activitiesData.map(item => item.activity_id)
  );
  const totalActivities = uniqueActivities.size;

  // Calculate average rating for unique activities only
  const uniqueActivityRatings = new Map();
  activitiesData.forEach(item => {
    if (!uniqueActivityRatings.has(item.activity_id)) {
      uniqueActivityRatings.set(item.activity_id, item.parent_rating || 0);
    }
  });

  const totalRating = Array.from(uniqueActivityRatings.values()).reduce(
    (sum, rating) => sum + rating,
    0
  );
  const averageRating = totalActivities > 0 ? totalRating / totalActivities : 0;

  // Get favorite activities (rated 5)
  const favoriteActivities = activitiesData
    .filter(item => item.parent_rating === 5)
    .slice(0, 3) // Top 3 favorites
    .map(item => ({
      activity: item.activity as unknown as Activity,
      rating: item.parent_rating || 0,
      completed_at: item.completed_at,
    }));

  return {
    total_activities: totalActivities,
    favorite_activities: favoriteActivities,
    average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
  };
}

// Get activity by ID for detail view
export async function getActivityById(
  activityId: string
): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) throw error;
  return data;
}
