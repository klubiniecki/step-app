import React from 'react';
import { View } from 'react-native';
import { Card, Icon, Text, useTheme } from 'react-native-paper';

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActivities: number;
  daysSinceLastActivity: number | null;
}

interface StreakStatsCardProps {
  streakStats: StreakStats;
}

export function StreakStatsCard({ streakStats }: StreakStatsCardProps) {
  const theme = useTheme();
  const getStreakMessage = () => {
    if (streakStats.currentStreak === 0) {
      return "Let's start your first streak! Complete an activity today.";
    } else if (streakStats.currentStreak === 1) {
      return 'Great start! Keep it going with another activity tomorrow.';
    } else if (streakStats.currentStreak < 7) {
      return `Awesome! You're on a ${streakStats.currentStreak}-day streak!`;
    } else if (streakStats.currentStreak < 30) {
      return `Incredible! ${streakStats.currentStreak} days strong!`;
    } else {
      return `Amazing! You're a streak champion with ${streakStats.currentStreak} days!`;
    }
  };

  return (
    <Card elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content>
        <Text variant='titleLarge' style={{ marginBottom: 16 }}>
          Your Streak
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon source='fire' size={32} color={theme.colors.primary} />
            <Text
              variant='headlineMedium'
              style={{ color: theme.colors.primary, marginTop: 4 }}
            >
              {streakStats.currentStreak}
            </Text>
            <Text variant='bodySmall'>Current</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Icon source='trophy' size={32} color={theme.colors.secondary} />
            <Text
              variant='headlineMedium'
              style={{ color: theme.colors.secondary, marginTop: 4 }}
            >
              {streakStats.longestStreak}
            </Text>
            <Text variant='bodySmall'>Best</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Icon source='star' size={32} color={theme.colors.tertiary} />
            <Text
              variant='headlineMedium'
              style={{ color: theme.colors.tertiary, marginTop: 4 }}
            >
              {streakStats.totalActivities}
            </Text>
            <Text variant='bodySmall'>Total</Text>
          </View>
        </View>

        <Text
          variant='bodyMedium'
          style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}
        >
          {getStreakMessage()}
        </Text>
      </Card.Content>
    </Card>
  );
}
