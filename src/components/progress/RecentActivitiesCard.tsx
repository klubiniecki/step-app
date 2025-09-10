import React from 'react';
import { View } from 'react-native';
import { Card, Divider, Icon, Text } from 'react-native-paper';

interface UserActivity {
  id: string;
  activity?: { title: string };
  completed_at: string;
  rating?: number;
  notes?: string;
}

interface RecentActivitiesCardProps {
  recentActivities: UserActivity[];
}

export function RecentActivitiesCard({
  recentActivities,
}: RecentActivitiesCardProps) {
  if (recentActivities.length === 0) {
    return null;
  }

  return (
    <Card elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content>
        <Text variant='titleLarge' style={{ marginBottom: 16 }}>
          Recent Activities
        </Text>

        {recentActivities.slice(0, 5).map((activity, index) => (
          <View key={activity.id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Icon
                source='star'
                size={16}
                color={activity.rating ? '#ffc107' : '#ccc'}
              />
              <Text variant='bodyMedium' style={{ marginLeft: 8, flex: 1 }}>
                {activity.activity?.title}
              </Text>
              <Text variant='bodySmall' style={{ color: '#666' }}>
                {new Date(activity.completed_at).toLocaleDateString()}
              </Text>
            </View>
            {activity.notes && (
              <Text
                variant='bodySmall'
                style={{ color: '#666', marginLeft: 24, marginBottom: 8 }}
              >
                &quot;{activity.notes}&quot;
              </Text>
            )}
            {index < recentActivities.slice(0, 5).length - 1 && (
              <Divider style={{ marginVertical: 8 }} />
            )}
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}
