import { useState } from 'react';
import type { Insight } from '../lib/types';

export function useSearch(insights: Insight[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInsights = insights.filter(
    insight =>
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredInsights,
  };
}
