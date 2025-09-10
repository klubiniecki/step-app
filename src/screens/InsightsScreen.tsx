import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { AgeRangeFilters } from '../components/insights/AgeRangeFilters';
import { CategoryFilters } from '../components/insights/CategoryFilters';
import { InsightsList } from '../components/insights/InsightsList';
import { useInsights } from '../hooks/useInsights';
import { useSearch } from '../hooks/useSearch';

export default function InsightsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');

  const { insights, loading, bookmarkStatus, loadInsights, toggleBookmark } =
    useInsights();
  const { searchQuery, setSearchQuery, filteredInsights } = useSearch(insights);

  useEffect(() => {
    loadInsights(selectedCategory, selectedAgeRange);
  }, [selectedCategory, selectedAgeRange, loadInsights]);

  const handleToggleBookmark = (insightId: string) => {
    toggleBookmark(insightId, selectedCategory, () =>
      loadInsights(selectedCategory, selectedAgeRange)
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Search Bar */}
      <Searchbar
        placeholder='Search insights...'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 16 }}
      />

      {/* Category Filters */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Age Range Filters */}
      <AgeRangeFilters
        selectedAgeRange={selectedAgeRange}
        onAgeRangeChange={setSelectedAgeRange}
      />

      {/* Insights List */}
      <InsightsList
        insights={filteredInsights}
        loading={loading}
        bookmarkStatus={bookmarkStatus}
        selectedCategory={selectedCategory}
        onToggleBookmark={handleToggleBookmark}
      />
    </ScrollView>
  );
}
