import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Icon, ProgressBar, Text, useTheme } from 'react-native-paper';

interface WeeklyProgressCardProps {
  weekDays: Array<{
    date: string;
    dayName: string;
    dayNumber: number;
    completed: boolean;
  }>;
  completionRate: number;
}

export function WeeklyProgressCard({
  weekDays,
  completionRate,
}: WeeklyProgressCardProps) {
  const theme = useTheme();
  return (
    <Card elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content>
        <Text variant='titleLarge' style={{ marginBottom: 16 }}>
          This Week&apos;s Progress
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {weekDays.map(day => (
            <View
              key={day.date}
              style={{
                alignItems: 'center',
                minWidth: 60,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: day.completed
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: day.completed
                      ? theme.colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  {day.dayNumber}
                </Text>
              </View>
              <Text
                variant='bodySmall'
                style={{
                  color: day.completed
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  fontWeight: day.completed ? 'bold' : 'normal',
                }}
              >
                {day.dayName}
              </Text>
              {day.completed && (
                <View style={{ marginTop: 4 }}>
                  <Icon source='check' size={16} color={theme.colors.primary} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Text variant='bodyMedium'>Weekly completion rate:</Text>
          <Text
            variant='bodyMedium'
            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
          >
            {Math.round(completionRate * 100)}%
          </Text>
        </View>

        <ProgressBar
          progress={completionRate}
          color={theme.colors.primary}
          style={{ marginTop: 8, height: 8, borderRadius: 4 }}
        />
      </Card.Content>
    </Card>
  );
}
