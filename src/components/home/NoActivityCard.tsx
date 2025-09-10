import React from 'react';
import { Card, Icon, Text } from 'react-native-paper';

export function NoActivityCard() {
  return (
    <Card elevation={2} style={{ marginBottom: 16 }}>
      <Card.Content style={{ alignItems: 'center', padding: 24 }}>
        <Icon source='alert-circle' size={48} color='#666' />
        <Text
          variant='titleMedium'
          style={{ marginTop: 12, textAlign: 'center' }}
        >
          No Activity Available
        </Text>
        <Text
          variant='bodyMedium'
          style={{ marginTop: 8, textAlign: 'center', color: '#666' }}
        >
          Add your children to get personalized activities
        </Text>
      </Card.Content>
    </Card>
  );
}
