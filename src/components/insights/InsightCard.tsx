import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Chip, Divider, Icon, Text } from 'react-native-paper';
import type { Insight } from '../../lib/types';

interface InsightCardProps {
  insight: Insight;
  isBookmarked: boolean;
  onToggleBookmark: (insightId: string) => void;
}

export function InsightCard({
  insight,
  isBookmarked,
  onToggleBookmark,
}: InsightCardProps) {
  return (
    <Card key={insight.id} elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Icon source='lightbulb' size={20} color='#ffc107' />
          <Text variant='titleMedium' style={{ marginLeft: 8, flex: 1 }}>
            {insight.title}
          </Text>
          <Chip mode='outlined' compact>
            {insight.category}
          </Chip>
        </View>

        <Text variant='bodyMedium' style={{ lineHeight: 20, marginBottom: 12 }}>
          {insight.content}
        </Text>

        <Divider style={{ marginVertical: 12 }} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant='bodySmall' style={{ color: '#666' }}>
            {new Date(insight.created_at).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => onToggleBookmark(insight.id)}
            style={{ padding: 4 }}
          >
            <Icon
              source={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={isBookmarked ? '#10b981' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}
