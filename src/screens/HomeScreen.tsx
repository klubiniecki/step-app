import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

export default function HomeScreen() {
	const { user, signOut } = useAuth();
	return (
		<View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
			<Text style={{ fontSize: 20 }}>Signed in as</Text>
			<Text selectable style={{ fontWeight: '600' }}>{user?.email}</Text>
			<Button title="Sign Out" onPress={signOut} />
		</View>
	);
}


