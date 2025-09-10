import React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';

const categories = [
  { key: 'all', label: 'All', icon: 'lightbulb' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'bonding', label: 'Bonding', icon: 'heart' },
  { key: 'communication', label: 'Communication', icon: 'chat' },
  { key: 'development', label: 'Development', icon: 'trending-up' },
  { key: 'behavior', label: 'Behavior', icon: 'account-group' },
  { key: 'emotions', label: 'Emotions', icon: 'emoticon-happy' },
];

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilters({
  selectedCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {categories.map(category => (
          <Chip
            key={category.key}
            selected={selectedCategory === category.key}
            onPress={() => onCategoryChange(category.key)}
            icon={category.icon}
            mode={selectedCategory === category.key ? 'flat' : 'outlined'}
            style={{
              backgroundColor:
                selectedCategory === category.key ? '#10b981' : 'transparent',
            }}
            textStyle={{
              color: selectedCategory === category.key ? 'white' : '#10b981',
            }}
          >
            {category.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}
