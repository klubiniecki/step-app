import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  Surface,
  Text,
} from 'react-native-paper';
import { ActivityRatingModal } from '../components/rating/ActivityRatingModal';
import { completeActivity, getTodaysActivity } from '../lib/activities';
import { listKids, type Kid } from '../lib/kids';
import { hasCompletedActivityToday } from '../lib/streaks';
import type { DailyActivity } from '../lib/types';

export default function ActivityScreen() {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(
    null
  );
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activity, kidsData, completedToday] = await Promise.all([
        getTodaysActivity(),
        listKids(),
        hasCompletedActivityToday(),
      ]);

      setDailyActivity(activity);
      setKids(kidsData);

      if (completedToday && activity) {
        setDailyActivity({ ...activity, is_completed: true });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = () => {
    if (selectedKids.length === 0) {
      Alert.alert(
        'Missing Information',
        'Please select at least one child who participated.'
      );
      return;
    }
    setRatingModalVisible(true);
  };

  const handleCompleteActivity = async (ratings: {
    parentRating: number;
    childRatings: { [kidId: string]: number };
    notes: string;
  }) => {
    if (!dailyActivity) return;

    try {
      setCompleting(true);

      // Complete activity for each selected child with their individual ratings
      const promises = selectedKids.map(kidId =>
        completeActivity(
          dailyActivity.activity.id,
          kidId || null, // Ensure kidId is string or null
          ratings.parentRating,
          ratings.notes || undefined,
          undefined, // duration not collected in this flow
          ratings.childRatings[kidId] || 0
        )
      );

      await Promise.all(promises);

      setRatingModalVisible(false);
      Alert.alert('Great job!', 'Activity completed successfully!', [
        { text: 'OK', onPress: loadData },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to complete activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setCompleting(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return '#4caf50'; // Green
      case 2:
        return '#ff9800'; // Orange
      case 3:
        return '#f44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  const isKidAgeAligned = (kid: Kid) => {
    if (!dailyActivity) return false;
    return (
      kid.age >= dailyActivity.activity.age_min &&
      kid.age <= dailyActivity.activity.age_max
    );
  };

  const toggleKidSelection = (kidId: string) => {
    setSelectedKids(prev =>
      prev.includes(kidId) ? prev.filter(id => id !== kidId) : [...prev, kidId]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
        <Text style={{ marginTop: 16 }}>Loading today&apos;s activity...</Text>
      </View>
    );
  }

  if (!dailyActivity) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Icon source='alert-circle' size={64} color='#666' />
        <Text
          variant='headlineSmall'
          style={{ textAlign: 'center', marginTop: 16 }}
        >
          No Activity Available
        </Text>
        <Text
          variant='bodyMedium'
          style={{ textAlign: 'center', marginTop: 8 }}
        >
          Make sure you have added your children to get personalized activities.
        </Text>
        <Button mode='contained' onPress={loadData} style={{ marginTop: 16 }}>
          Refresh
        </Button>
      </View>
    );
  }

  const { activity, is_completed, streak_count } = dailyActivity;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Streak Header */}
      <Surface
        elevation={1}
        style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text variant='titleMedium'>Current Streak</Text>
            <Text variant='headlineMedium' style={{ color: '#10b981' }}>
              {streak_count} days
            </Text>
          </View>
          <Icon source='fire' size={32} color='#ff6b35' />
        </View>
      </Surface>

      {/* Activity Card */}
      <Card elevation={2} style={{ marginBottom: 16 }}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text variant='headlineSmall' style={{ flex: 1 }}>
              {activity.title}
            </Text>
            {is_completed && (
              <Icon source='check-circle' size={24} color='#4caf50' />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Chip icon='clock' mode='outlined' compact>
              {activity.duration_minutes} min
            </Chip>
            <Chip icon='account-group' mode='outlined' compact>
              Ages {activity.age_min}-{activity.age_max}
            </Chip>
            <Chip
              icon='star'
              mode='outlined'
              compact
              textStyle={{
                color: getDifficultyColor(activity.difficulty_level),
              }}
            >
              {getDifficultyText(activity.difficulty_level)}
            </Chip>
            <Chip icon='tag' mode='outlined' compact>
              {activity.category}
            </Chip>
          </View>

          <Text variant='bodyMedium' style={{ marginBottom: 16 }}>
            {activity.description}
          </Text>

          <Divider style={{ marginVertical: 12 }} />

          <Text variant='titleMedium' style={{ marginBottom: 8 }}>
            Instructions:
          </Text>
          <Text variant='bodyMedium'>{activity.instructions}</Text>

          {activity.materials_needed.length > 0 && (
            <>
              <Divider style={{ marginVertical: 12 }} />
              <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                Materials Needed:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {activity.materials_needed.map((material, index) => (
                  <Chip key={index} mode='outlined' compact>
                    {material}
                  </Chip>
                ))}
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Completion Form */}
      {!is_completed && (
        <Surface elevation={1} style={{ padding: 16, borderRadius: 12 }}>
          <Text variant='titleMedium' style={{ marginBottom: 16 }}>
            Complete Activity
          </Text>

          {/* Kid Selection */}
          {kids.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text variant='bodyMedium' style={{ marginBottom: 8 }}>
                Which children participated? (Select multiple)
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {kids.map(kid => {
                  const isSelected = selectedKids.includes(kid.id);
                  const isAgeAligned = isKidAgeAligned(kid);

                  return (
                    <Chip
                      key={kid.id}
                      selected={isSelected}
                      onPress={() => toggleKidSelection(kid.id)}
                      mode={isSelected ? 'flat' : 'outlined'}
                      style={{
                        backgroundColor: isSelected
                          ? '#10b981'
                          : isAgeAligned
                            ? '#e8f5e8'
                            : undefined,
                        borderColor: isAgeAligned ? '#10b981' : undefined,
                      }}
                      textStyle={{
                        color: isSelected
                          ? 'white'
                          : isAgeAligned
                            ? '#10b981'
                            : undefined,
                        fontWeight: isAgeAligned ? 'bold' : undefined,
                      }}
                      icon={isAgeAligned ? 'star' : undefined}
                    >
                      {kid.name} ({kid.age})
                      {isAgeAligned && !isSelected && ' ✓'}
                    </Chip>
                  );
                })}
              </View>
              {kids.some(isKidAgeAligned) && (
                <Text
                  variant='bodySmall'
                  style={{
                    marginTop: 4,
                    color: '#10b981',
                    fontStyle: 'italic',
                  }}
                >
                  ✓ Recommended for your child&apos;s age
                </Text>
              )}
            </View>
          )}

          <Button
            mode='contained'
            onPress={handleStartActivity}
            loading={completing}
            disabled={completing || selectedKids.length === 0}
            icon='check'
          >
            Start Activity
          </Button>

          {selectedKids.length === 0 && (
            <Text
              variant='bodySmall'
              style={{ marginTop: 8, color: '#f44336', textAlign: 'center' }}
            >
              Please select at least one child to complete the activity
            </Text>
          )}
        </Surface>
      )}

      {is_completed && (
        <Surface
          elevation={1}
          style={{ padding: 16, borderRadius: 12, backgroundColor: '#e8f5e8' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source='check-circle' size={24} color='#4caf50' />
            <Text
              variant='titleMedium'
              style={{ marginLeft: 8, color: '#2e7d32' }}
            >
              Activity Completed!
            </Text>
          </View>
          <Text variant='bodyMedium' style={{ marginTop: 8, color: '#2e7d32' }}>
            Great job completing today&apos;s activity. Keep up the streak!
          </Text>
        </Surface>
      )}

      {/* Rating Modal */}
      {dailyActivity && (
        <ActivityRatingModal
          visible={ratingModalVisible}
          onDismiss={() => setRatingModalVisible(false)}
          activity={dailyActivity.activity}
          selectedKids={kids.filter(kid => selectedKids.includes(kid.id))}
          onComplete={handleCompleteActivity}
          loading={completing}
        />
      )}
    </ScrollView>
  );
}
