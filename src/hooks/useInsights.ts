import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import {
  bookmarkInsight,
  getBookmarkStatus,
  getBookmarkedInsights,
  unbookmarkInsight,
} from '../lib/bookmarks';
import { getInsightsByCategory, getRelevantInsights } from '../lib/insights';
import type { Insight } from '../lib/types';

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkStatus, setBookmarkStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const loadInsights = useCallback(
    async (selectedCategory: string, selectedAgeRange: string) => {
      try {
        setLoading(true);
        let data: Insight[];

        if (selectedCategory === 'saved') {
          data = await getBookmarkedInsights();
        } else if (selectedCategory === 'all') {
          data = await getRelevantInsights();
        } else {
          data = await getInsightsByCategory(selectedCategory);
        }

        // Filter by age range if not 'all'
        if (selectedAgeRange !== 'all') {
          data = data.filter(
            insight =>
              insight.age_range === selectedAgeRange ||
              insight.age_range === 'all'
          );
        }

        setInsights(data);

        // Load bookmark status for all insights
        if (data.length > 0) {
          const insightIds = data.map(insight => insight.id);
          const status = await getBookmarkStatus(insightIds);
          setBookmarkStatus(status);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load insights';
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleBookmark = useCallback(
    async (
      insightId: string,
      selectedCategory: string,
      onReload: () => void
    ) => {
      try {
        const isBookmarked = bookmarkStatus[insightId];

        if (isBookmarked) {
          await unbookmarkInsight(insightId);
        } else {
          await bookmarkInsight(insightId);
        }

        // Update local state
        setBookmarkStatus(prev => ({
          ...prev,
          [insightId]: !isBookmarked,
        }));

        // If we're in saved category, reload the insights
        if (selectedCategory === 'saved') {
          onReload();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update bookmark';
        Alert.alert('Error', errorMessage);
      }
    },
    [bookmarkStatus]
  );

  return {
    insights,
    loading,
    bookmarkStatus,
    loadInsights,
    toggleBookmark,
  };
}
