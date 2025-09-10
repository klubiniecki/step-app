import React from 'react';
import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';

interface QuickStatsProps {
  streakStats: {
    currentStreak: number;
    longestStreak: number;
    totalActivities: number;
    daysSinceLastActivity: number | null;
  };
}

export function QuickStats({ streakStats }: QuickStatsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
      <Card style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Icon source='fire' size={32} color='#ff6b35' />
          <Text
            variant='headlineMedium'
            style={{ color: '#ff6b35', marginTop: 4 }}
          >
            {streakStats.currentStreak}
          </Text>
          <Text variant='bodySmall'>Day Streak</Text>
        </View>
      </Card>
      <Card style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Icon source='star' size={32} color='#2196f3' />
          <Text
            variant='headlineMedium'
            style={{ color: '#2196f3', marginTop: 4 }}
          >
            {streakStats.totalActivities}
          </Text>
          <Text variant='bodySmall'>Activities</Text>
        </View>
      </Card>
    </View>
  );
}
