import { useCallback, useEffect, useState } from 'react';
import { getTodaysActivity } from '../lib/activities';
import { getRandomInsight } from '../lib/insights';
import { listKids, type Kid } from '../lib/kids';
import { getStreakStats } from '../lib/streaks';
import type { DailyActivity, Insight } from '../lib/types';

export function useHomeData() {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(
    null
  );
  const [streakStats, setStreakStats] = useState<{
    currentStreak: number;
    longestStreak: number;
    totalActivities: number;
    daysSinceLastActivity: number | null;
  } | null>(null);
  const [randomInsight, setRandomInsight] = useState<Insight | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      const [activity, stats, insight, kidsData] = await Promise.all([
        getTodaysActivity(),
        getStreakStats(),
        getRandomInsight(),
        listKids(),
      ]);

      setDailyActivity(activity);
      setStreakStats(stats);
      setRandomInsight(insight);
      setKids(kidsData);
    } catch {
      // Handle error silently for now
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return {
    dailyActivity,
    streakStats,
    randomInsight,
    kids,
    loading,
    loadHomeData,
  };
}
