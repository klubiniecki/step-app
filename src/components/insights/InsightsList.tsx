import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { Insight } from '../../lib/types';
import { EmptyInsightsState } from './EmptyInsightsState';
import { InsightCard } from './InsightCard';

interface InsightsListProps {
  insights: Insight[];
  loading: boolean;
  bookmarkStatus: { [key: string]: boolean };
  selectedCategory: string;
  onToggleBookmark: (insightId: string) => void;
}

export function InsightsList({
  insights,
  loading,
  bookmarkStatus,
  selectedCategory,
  onToggleBookmark,
}: InsightsListProps) {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (insights.length === 0) {
    return <EmptyInsightsState selectedCategory={selectedCategory} />;
  }

  return (
    <>
      {insights.map(insight => (
        <InsightCard
          key={insight.id}
          insight={insight}
          isBookmarked={bookmarkStatus[insight.id] || false}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </>
  );
}
