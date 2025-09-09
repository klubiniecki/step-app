import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function AboutScreen() {
  const { user, updateDisplayName } = useAuth();
  const [name, setName] = useState<string>(
    (user?.user_metadata as { display_name?: string })?.display_name ?? ''
  );
  const [saving, setSaving] = useState(false);
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Surface elevation={1} style={{ padding: 16, borderRadius: 12, gap: 8 }}>
        <Text variant='headlineSmall'>About</Text>
        <Text>Your account email:</Text>
        <Text selectable style={{ fontWeight: '600' }}>
          {user?.email ?? 'Unknown'}
        </Text>
        <TextInput label='Display name' value={name} onChangeText={setName} />
        <Button
          mode='contained'
          loading={saving}
          disabled={saving}
          onPress={async () => {
            setSaving(true);
            await updateDisplayName(name);
            setSaving(false);
          }}
        >
          Save
        </Button>
      </Surface>
    </View>
  );
}
