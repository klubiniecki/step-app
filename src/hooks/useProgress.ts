import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getUserActivities } from '../lib/activities';
import { getStreakStats, getWeeklyActivityCompletion } from '../lib/streaks';

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActivities: number;
  daysSinceLastActivity: number | null;
}

interface WeeklyCompletion {
  [key: string]: boolean;
}

interface UserActivity {
  id: string;
  activity?: { title: string };
  completed_at: string;
  rating?: number;
  notes?: string;
}

export function useProgress() {
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  const [weeklyCompletion, setWeeklyCompletion] = useState<WeeklyCompletion>(
    {}
  );
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      const [stats, weekly, activities] = await Promise.all([
        getStreakStats(),
        getWeeklyActivityCompletion(),
        getUserActivities(10),
      ]);

      setStreakStats(stats);
      setWeeklyCompletion(weekly);

      // Deduplicate activities by activity title, keeping the most recent completion
      const uniqueActivities = activities.reduce(
        (acc, activity) => {
          const activityTitle = activity.activity?.title;
          if (!activityTitle) return acc;

          const existing = acc.find(a => a.activity?.title === activityTitle);
          if (!existing) {
            acc.push(activity);
          } else {
            // Keep the more recent completion
            const existingDate = new Date(existing.completed_at);
            const currentDate = new Date(activity.completed_at);
            if (currentDate > existingDate) {
              const index = acc.findIndex(
                a => a.activity?.title === activityTitle
              );
              acc[index] = activity;
            }
          }
          return acc;
        },
        [] as typeof activities
      );

      setRecentActivities(uniqueActivities);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load progress data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  return {
    streakStats,
    weeklyCompletion,
    recentActivities,
    loading,
    loadProgressData,
  };
}
