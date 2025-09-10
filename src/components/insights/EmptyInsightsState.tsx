import React from 'react';
import { Icon, Surface, Text } from 'react-native-paper';

interface EmptyInsightsStateProps {
  selectedCategory: string;
}

export function EmptyInsightsState({
  selectedCategory,
}: EmptyInsightsStateProps) {
  return (
    <Surface
      elevation={1}
      style={{ padding: 24, borderRadius: 12, alignItems: 'center' }}
    >
      <Icon
        source={
          selectedCategory === 'saved'
            ? 'bookmark-outline'
            : 'lightbulb-outline'
        }
        size={48}
        color='#666'
      />
      <Text
        variant='headlineSmall'
        style={{ marginTop: 16, textAlign: 'center' }}
      >
        {selectedCategory === 'saved'
          ? 'No Saved Insights'
          : 'No Insights Found'}
      </Text>
      <Text
        variant='bodyMedium'
        style={{ marginTop: 8, textAlign: 'center', color: '#666' }}
      >
        {selectedCategory === 'saved'
          ? 'Bookmark insights you find helpful to see them here.'
          : 'Try adjusting your filters or search terms.'}
      </Text>
    </Surface>
  );
}
