import React from 'react';
import { View } from 'react-native';
import { Text, Button, Surface, Icon } from 'react-native-paper';

export default function LandingScreen({ navigation }: any) {
	return (
		<View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 24, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
			<Surface elevation={2} style={{ padding: 24, borderRadius: 16, alignItems: 'center', gap: 12 }}>
				<Icon source="foot-print" size={64} />
				<Text variant="headlineMedium">Small Steps</Text>
				<Text variant="bodyMedium" style={{ textAlign: 'center', maxWidth: 320 }}>
					Connect parents and kids through small, meaningful steps.
				</Text>
				<Button mode="contained" onPress={() => navigation.replace('Auth')}>Get Started</Button>
			</Surface>
		</View>
	);
}


