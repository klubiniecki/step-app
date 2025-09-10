import React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';

const ageRanges = [
  { key: 'all', label: 'All Ages' },
  { key: '4-6', label: 'Ages 4-6' },
  { key: '7-8', label: 'Ages 7-8' },
  { key: '9-10', label: 'Ages 9-10' },
];

interface AgeRangeFiltersProps {
  selectedAgeRange: string;
  onAgeRangeChange: (ageRange: string) => void;
}

export function AgeRangeFilters({
  selectedAgeRange,
  onAgeRangeChange,
}: AgeRangeFiltersProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {ageRanges.map(range => (
          <Chip
            key={range.key}
            selected={selectedAgeRange === range.key}
            onPress={() => onAgeRangeChange(range.key)}
            mode={selectedAgeRange === range.key ? 'flat' : 'outlined'}
            style={{
              backgroundColor:
                selectedAgeRange === range.key ? '#10b981' : 'transparent',
            }}
            textStyle={{
              color: selectedAgeRange === range.key ? 'white' : '#10b981',
            }}
          >
            {range.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}
