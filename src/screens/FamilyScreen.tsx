import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Icon,
  IconButton,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { ActivityDetailModal } from '../components/activity/ActivityDetailModal';
import { useFamilyStats } from '../hooks/useFamilyStats';
import { Kid, createKid, deleteKid, listKids, updateKid } from '../lib/kids';
import { getActivityById } from '../lib/statistics';
import type { Activity } from '../lib/types';

export default function FamilyScreen() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [activityModalVisible, setActivityModalVisible] = useState(false);

  const { childStats, parentStats } = useFamilyStats();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listKids();
      setKids(data);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'Failed to load kids';
      Alert.alert('Error', errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async () => {
    try {
      if (!name || !age)
        return Alert.alert('Missing fields', 'Name and age are required');
      const ageNum = Number(age);
      if (Number.isNaN(ageNum) || ageNum < 0)
        return Alert.alert('Invalid age', 'Enter a valid age');
      if (editingId) {
        await updateKid(editingId, { name, age: ageNum });
      } else {
        await createKid(name, ageNum);
      }
      setName('');
      setAge('');
      setEditingId(null);
      await refresh();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'Failed to save kid';
      Alert.alert('Error', errorMessage);
    }
  };

  const onEdit = (kid: Kid) => {
    setName(kid.name);
    setAge(kid.age.toString());
    setEditingId(kid.id);
  };

  const onDelete = async (id: string) => {
    Alert.alert(
      'Delete Child',
      'Are you sure you want to delete this child? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteKid(id);
              await refresh();
            } catch (e: unknown) {
              const errorMessage =
                e instanceof Error ? e.message : 'Failed to delete kid';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleActivityPress = async (activityId: string) => {
    try {
      const activity = await getActivityById(activityId);
      if (activity) {
        setSelectedActivity(activity);
        setActivityModalVisible(true);
      }
    } catch {
      Alert.alert('Error', 'Failed to load activity details');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
        <Text style={{ marginTop: 16 }}>Loading family...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Add/Edit Child Form */}
      <Surface
        elevation={1}
        style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}
      >
        <Text variant='titleLarge' style={{ marginBottom: 16 }}>
          {editingId ? 'Edit Child' : 'Add Child'}
        </Text>
        <TextInput
          label='Name'
          value={name}
          onChangeText={setName}
          mode='outlined'
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label='Age'
          value={age}
          onChangeText={setAge}
          mode='outlined'
          keyboardType='numeric'
          style={{ marginBottom: 16 }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            mode='contained'
            onPress={onSubmit}
            disabled={!name || !age}
            style={{ flex: 1 }}
          >
            {editingId ? 'Update' : 'Add'}
          </Button>
          {editingId && (
            <Button
              mode='outlined'
              onPress={() => {
                setName('');
                setAge('');
                setEditingId(null);
              }}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          )}
        </View>
      </Surface>

      {/* Parent Statistics */}
      {parentStats && parentStats.total_activities > 0 && (
        <Card elevation={2} style={{ marginBottom: 16 }}>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Icon source='account' size={24} color='#9c27b0' />
              <Text variant='titleLarge' style={{ marginLeft: 8 }}>
                Your Activity Stats
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text variant='headlineMedium' style={{ color: '#10b981' }}>
                  {parentStats.total_activities}
                </Text>
                <Text variant='bodySmall'>Activities</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text variant='headlineMedium' style={{ color: '#ffc107' }}>
                  {parentStats.average_rating}
                </Text>
                <Text variant='bodySmall'>Avg Rating</Text>
              </View>
            </View>

            {parentStats.favorite_activities.length > 0 && (
              <View>
                <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                  Your Favorites ⭐
                </Text>
                {parentStats.favorite_activities.map((fav, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleActivityPress(fav.activity.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Icon source='star' size={16} color='#ffc107' />
                    <Text
                      variant='bodyMedium'
                      style={{ marginLeft: 8, flex: 1 }}
                    >
                      {fav.activity.title}
                    </Text>
                    <Text variant='bodySmall' style={{ color: '#666' }}>
                      {fav.rating}/5
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Children List with Statistics */}
      {kids.length === 0 ? (
        <Surface
          elevation={1}
          style={{ padding: 24, borderRadius: 12, alignItems: 'center' }}
        >
          <Icon source='account-group' size={48} color='#666' />
          <Text
            variant='titleMedium'
            style={{ marginTop: 16, textAlign: 'center' }}
          >
            No Children Added
          </Text>
          <Text
            variant='bodyMedium'
            style={{ marginTop: 8, textAlign: 'center', color: '#666' }}
          >
            Add your children to see their activity statistics and favorites
          </Text>
        </Surface>
      ) : (
        kids.map(kid => {
          const kidStats = childStats.find(stat => stat.kid_id === kid.id);

          return (
            <Card key={kid.id} elevation={2} style={{ marginBottom: 16 }}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <Icon source='account' size={24} color='#2196f3' />
                    <Text variant='titleLarge' style={{ marginLeft: 8 }}>
                      {kid.name}
                    </Text>
                    <Text
                      variant='bodyMedium'
                      style={{ marginLeft: 8, color: '#666' }}
                    >
                      (Age {kid.age})
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <IconButton
                      icon='pencil'
                      size={20}
                      onPress={() => onEdit(kid)}
                    />
                    <IconButton
                      icon='delete'
                      size={20}
                      onPress={() => onDelete(kid.id)}
                    />
                  </View>
                </View>

                {kidStats ? (
                  <View>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                          variant='headlineMedium'
                          style={{ color: '#10b981' }}
                        >
                          {kidStats.total_activities}
                        </Text>
                        <Text variant='bodySmall'>Activities</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                          variant='headlineMedium'
                          style={{ color: '#ffc107' }}
                        >
                          {kidStats.average_rating}
                        </Text>
                        <Text variant='bodySmall'>Avg Rating</Text>
                      </View>
                    </View>

                    {kidStats.favorite_activities.length > 0 && (
                      <View>
                        <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                          {kid.name}&apos;s Favorites ⭐
                        </Text>
                        {kidStats.favorite_activities.map((fav, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleActivityPress(fav.activity.id)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              backgroundColor: '#f8f9fa',
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          >
                            <Icon source='star' size={16} color='#ffc107' />
                            <Text
                              variant='bodyMedium'
                              style={{ marginLeft: 8, flex: 1 }}
                            >
                              {fav.activity.title}
                            </Text>
                            <Text variant='bodySmall' style={{ color: '#666' }}>
                              {fav.rating}/5
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                    <Icon source='star-outline' size={32} color='#ccc' />
                    <Text
                      variant='bodyMedium'
                      style={{ color: '#666', marginTop: 8 }}
                    >
                      No activities completed yet
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          );
        })
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        visible={activityModalVisible}
        onDismiss={() => setActivityModalVisible(false)}
        activity={selectedActivity}
      />
    </ScrollView>
  );
}
