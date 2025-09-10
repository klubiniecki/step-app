import React from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';
import { RecentActivitiesCard } from '../components/progress/RecentActivitiesCard';
import { StreakStatsCard } from '../components/progress/StreakStatsCard';
import { WeeklyProgressCard } from '../components/progress/WeeklyProgressCard';
import { useProgress } from '../hooks/useProgress';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';

export default function ProgressScreen() {
  const { streakStats, weeklyCompletion, recentActivities, loading } =
    useProgress();
  const { getWeekDays, getCompletionRate } =
    useWeeklyProgress(weeklyCompletion);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
        <Text style={{ marginTop: 16 }}>Loading your progress...</Text>
      </View>
    );
  }

  const weekDays = getWeekDays();
  const completionRate = getCompletionRate();

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Weekly Progress */}
      <WeeklyProgressCard weekDays={weekDays} completionRate={completionRate} />

      {/* Streak Stats */}
      {streakStats && <StreakStatsCard streakStats={streakStats} />}

      {/* Recent Activities */}
      <RecentActivitiesCard recentActivities={recentActivities} />

      {/* Motivational Message */}
      <Surface
        elevation={1}
        style={{
          padding: 20,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text
          variant='headlineSmall'
          style={{ textAlign: 'center', marginBottom: 8 }}
        >
          Keep Going! 🎉
        </Text>
        <Text
          variant='bodyMedium'
          style={{ textAlign: 'center', color: '#666' }}
        >
          Every small step counts towards building stronger connections with
          your children.
        </Text>
      </Surface>
    </ScrollView>
  );
}
