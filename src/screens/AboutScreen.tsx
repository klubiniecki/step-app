import React from 'react';
import { View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function AboutScreen() {
	const { user } = useAuth();
	return (
		<View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
			<Surface elevation={1} style={{ padding: 16, borderRadius: 12, gap: 8 }}>
				<Text variant="headlineSmall">About</Text>
				<Text>Your account email:</Text>
				<Text selectable style={{ fontWeight: '600' }}>{user?.email ?? 'Unknown'}</Text>
			</Surface>
		</View>
	);
}


