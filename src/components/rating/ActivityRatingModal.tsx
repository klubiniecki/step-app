import React, { useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Portal,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import type { Kid } from '../../lib/kids';
import type { Activity } from '../../lib/types';

interface ActivityRatingModalProps {
  visible: boolean;
  onDismiss: () => void;
  activity: Activity;
  selectedKids: Kid[];
  onComplete: (ratings: {
    parentRating: number;
    childRatings: { [kidId: string]: number };
    notes: string;
  }) => void;
  loading?: boolean;
}

export function ActivityRatingModal({
  visible,
  onDismiss,
  activity,
  selectedKids,
  onComplete,
  loading = false,
}: ActivityRatingModalProps) {
  const theme = useTheme();
  const [parentRating, setParentRating] = useState(0);
  const [childRatings, setChildRatings] = useState<{ [kidId: string]: number }>(
    {}
  );
  const [notes, setNotes] = useState('');

  const handleComplete = () => {
    if (parentRating === 0) {
      Alert.alert('Rating Required', 'Please rate this activity as a parent.');
      return;
    }

    // Check if at least one child has rated
    const hasChildRating = selectedKids.some(kid => childRatings[kid.id] > 0);
    if (!hasChildRating) {
      Alert.alert(
        'Rating Required',
        'Please have at least one child rate this activity.'
      );
      return;
    }

    onComplete({
      parentRating,
      childRatings,
      notes,
    });
  };

  const handleChildRating = (kidId: string, rating: number) => {
    setChildRatings(prev => ({
      ...prev,
      [kidId]: rating,
    }));
  };

  const resetForm = () => {
    setParentRating(0);
    setChildRatings({});
    setNotes('');
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        style={{
          backgroundColor: theme.colors.surface,
          margin: 20,
          borderRadius: 12,
          maxHeight: '90%',
        }}
      >
        <ScrollView>
          <Card.Content style={{ padding: 20 }}>
            {/* Activity Header */}
            <View style={{ marginBottom: 20 }}>
              <Text variant='headlineSmall' style={{ marginBottom: 8 }}>
                {activity.title}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Chip icon='clock' mode='outlined' compact>
                  {activity.duration_minutes} min
                </Chip>
                <Chip icon='account-group' mode='outlined' compact>
                  Ages {activity.age_min}-{activity.age_max}
                </Chip>
                <Chip icon='tag' mode='outlined' compact>
                  {activity.category}
                </Chip>
              </View>
            </View>

            <Divider style={{ marginBottom: 20 }} />

            {/* Parent Rating */}
            <View style={{ marginBottom: 24 }}>
              <Text variant='titleMedium' style={{ marginBottom: 12 }}>
                How did you enjoy this activity? ⭐
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <RadioButton
                    key={rating}
                    value={rating.toString()}
                    status={parentRating === rating ? 'checked' : 'unchecked'}
                    onPress={() => setParentRating(rating)}
                  />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <Text
                  variant='bodySmall'
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Not great
                </Text>
                <Text
                  variant='bodySmall'
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Amazing!
                </Text>
              </View>
            </View>

            {/* Child Ratings */}
            {selectedKids.map(kid => (
              <View key={kid.id} style={{ marginBottom: 24 }}>
                <Text variant='titleMedium' style={{ marginBottom: 12 }}>
                  How did {kid.name} enjoy this activity? ⭐
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <RadioButton
                      key={rating}
                      value={rating.toString()}
                      status={
                        childRatings[kid.id] === rating
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => handleChildRating(kid.id, rating)}
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <Text
                    variant='bodySmall'
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Not great
                  </Text>
                  <Text
                    variant='bodySmall'
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Amazing!
                  </Text>
                </View>
              </View>
            ))}

            {/* Notes */}
            <View style={{ marginBottom: 24 }}>
              <Text variant='titleMedium' style={{ marginBottom: 12 }}>
                Notes (optional)
              </Text>
              <TextInput
                mode='outlined'
                placeholder='Share any thoughts about this activity...'
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                mode='outlined'
                onPress={handleDismiss}
                style={{ flex: 1 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                mode='contained'
                onPress={handleComplete}
                style={{ flex: 1 }}
                loading={loading}
                disabled={loading}
              >
                Complete Activity
              </Button>
            </View>
          </Card.Content>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
