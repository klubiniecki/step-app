import React from 'react';
import { View } from 'react-native';
import { Card, Chip, Icon, Text } from 'react-native-paper';
import type { Kid } from '../../lib/kids';

interface FamilyOverviewProps {
  kids: Kid[];
}

export function FamilyOverview({ kids }: FamilyOverviewProps) {
  if (kids.length === 0) {
    return null;
  }

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
          <Icon source='account-group' size={24} color='#9c27b0' />
          <Text variant='titleLarge' style={{ marginLeft: 8 }}>
            Your Family
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {kids.map(kid => (
            <Chip key={kid.id} mode='outlined' icon='account'>
              {kid.name} ({kid.age})
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
