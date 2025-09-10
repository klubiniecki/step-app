import React from 'react';
import { View } from 'react-native';
import { Button, Card, Chip, Icon, Text } from 'react-native-paper';
import type { DailyActivity } from '../../lib/types';

interface TodaysActivityCardProps {
  dailyActivity: DailyActivity;
}

export function TodaysActivityCard({ dailyActivity }: TodaysActivityCardProps) {
  return (
    <Card elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Icon source='star' size={24} color='#ffc107' />
          <Text variant='titleLarge' style={{ marginLeft: 8, flex: 1 }}>
            Today&apos;s Activity
          </Text>
        </View>

        <Text variant='titleMedium' style={{ marginBottom: 12 }}>
          {dailyActivity.activity.title}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Chip icon='clock' mode='outlined' compact>
            {dailyActivity.activity.duration_minutes} min
          </Chip>
          <Chip icon='account-group' mode='outlined' compact>
            Ages {dailyActivity.activity.age_min}-
            {dailyActivity.activity.age_max}
          </Chip>
          <Chip icon='tag' mode='outlined' compact>
            {dailyActivity.activity.category}
          </Chip>
        </View>

        <Text variant='bodyMedium' style={{ marginBottom: 16 }}>
          {dailyActivity.activity.description}
        </Text>

        <Button
          mode={dailyActivity.is_completed ? 'outlined' : 'contained'}
          icon={dailyActivity.is_completed ? 'check' : 'play'}
          onPress={() => {
            // Navigation would be handled by the tab navigator
          }}
        >
          {dailyActivity.is_completed ? 'Completed!' : 'Start Activity'}
        </Button>
      </Card.Content>
    </Card>
  );
}
