import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import type { Activity } from '../../lib/types';

interface ActivityDetailModalProps {
  visible: boolean;
  onDismiss: () => void;
  activity: Activity | null;
}

export function ActivityDetailModal({
  visible,
  onDismiss,
  activity,
}: ActivityDetailModalProps) {
  const theme = useTheme();
  if (!activity) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
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
                <Chip icon='star' mode='outlined' compact>
                  Level {activity.difficulty_level}
                </Chip>
              </View>
            </View>

            <Divider style={{ marginBottom: 20 }} />

            {/* Description */}
            <View style={{ marginBottom: 20 }}>
              <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                Description
              </Text>
              <Text variant='bodyMedium' style={{ lineHeight: 20 }}>
                {activity.description}
              </Text>
            </View>

            {/* Materials Needed */}
            {activity.materials_needed &&
              activity.materials_needed.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                    Materials Needed
                  </Text>
                  <View
                    style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                  >
                    {activity.materials_needed.map((material, index) => (
                      <Chip key={index} mode='outlined' icon='check'>
                        {material}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

            {/* Instructions */}
            {activity.instructions &&
              Array.isArray(activity.instructions) &&
              activity.instructions.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text variant='titleMedium' style={{ marginBottom: 8 }}>
                    Instructions
                  </Text>
                  {activity.instructions.map(
                    (instruction: string, index: number) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          marginBottom: 8,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Text
                          variant='bodyMedium'
                          style={{
                            marginRight: 12,
                            marginTop: 2,
                            fontWeight: 'bold',
                            color: theme.colors.primary,
                          }}
                        >
                          {index + 1}.
                        </Text>
                        <Text
                          variant='bodyMedium'
                          style={{ flex: 1, lineHeight: 20 }}
                        >
                          {instruction}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}

            {/* Close Button */}
            <Button
              mode='contained'
              onPress={onDismiss}
              style={{ marginTop: 20 }}
            >
              Close
            </Button>
          </Card.Content>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
