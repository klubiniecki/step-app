import React from 'react';
import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
import type { Insight } from '../../lib/types';

interface DailyInsightProps {
  insight: Insight;
}

export function DailyInsight({ insight }: DailyInsightProps) {
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
          <Icon source='lightbulb' size={24} color='#ffc107' />
          <Text variant='titleLarge' style={{ marginLeft: 8 }}>
            Daily Insight
          </Text>
        </View>
        <Text variant='titleMedium' style={{ marginBottom: 8 }}>
          {insight.title}
        </Text>
        <Text variant='bodyMedium' style={{ lineHeight: 20 }}>
          {insight.content}
        </Text>
      </Card.Content>
    </Card>
  );
}
