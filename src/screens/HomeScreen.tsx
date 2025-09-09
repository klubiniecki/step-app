import React from 'react';
import { View } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function HomeScreen() {
	const { user, signOut } = useAuth();
	return (
		<View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 24, gap: 16, justifyContent: 'center' }}>
			<Surface elevation={1} style={{ padding: 16, borderRadius: 12, gap: 12 }}>
				<Text variant="titleMedium">Signed in as</Text>
				<Text selectable style={{ fontWeight: '600' }}>{user?.email}</Text>
				<Button mode="contained" onPress={signOut}>Sign Out</Button>
			</Surface>
		</View>
	);
}


