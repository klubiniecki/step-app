import React from 'react';
import { View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

export function QuickActions() {
  return (
    <Surface
      elevation={1}
      style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}
    >
      <Text variant='titleMedium' style={{ marginBottom: 12 }}>
        Quick Actions
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button
          mode='outlined'
          icon='account-plus'
          onPress={() => {
            // Navigate to family screen
          }}
          style={{ flex: 1 }}
        >
          Add Child
        </Button>
        <Button
          mode='outlined'
          icon='chart-line'
          onPress={() => {
            // Navigate to progress screen
          }}
          style={{ flex: 1 }}
        >
          View Progress
        </Button>
      </View>
    </Surface>
  );
}
