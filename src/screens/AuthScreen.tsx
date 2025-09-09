import React, { useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [busy, setBusy] = useState(false);

	const redirectUri = useMemo(() => makeRedirectUri({ useProxy: true, scheme: 'supabaseauth' }), []);

	// redirectUri is passed to Supabase signInWithOAuth with PKCE flow

	const signIn = async () => {
		if (!email || !password) return Alert.alert('Missing fields', 'Email and password are required.');
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		setBusy(false);
		if (error) Alert.alert('Sign-in failed', error.message);
	};

	const signUp = async () => {
		if (!email || !password) return Alert.alert('Missing fields', 'Email and password are required.');
		setBusy(true);
		const { error } = await supabase.auth.signUp({ email, password });
		setBusy(false);
		if (error) Alert.alert('Sign-up failed', error.message);
		else Alert.alert('Check your email', 'Confirm your account if email confirmation is enabled.');
	};

	const signInWithGoogle = async () => {
		try {
			setBusy(true);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: redirectUri,
					flowType: 'pkce',
				},
			});
			setBusy(false);
			if (error) {
				Alert.alert('Google login failed', error.message);
				return;
			}
			if (data?.url) {
				await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
			}
		} catch (e: any) {
			setBusy(false);
			Alert.alert('Google login error', e?.message ?? 'Unknown error');
		}
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 24, gap: 16, justifyContent: 'center' }}>
			<Text variant="headlineMedium">Welcome</Text>
			<Surface elevation={1} style={{ padding: 16, borderRadius: 12, gap: 12 }}>
				<TextInput
					label="Email"
					autoCapitalize="none"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					label="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
				{busy ? (
					<ActivityIndicator />
				) : (
					<View style={{ gap: 10 }}>
						<Button mode="contained" onPress={signIn}>Sign In</Button>
						<Button mode="outlined" onPress={signUp}>Sign Up</Button>
						<Button mode="text" onPress={signInWithGoogle}>Continue with Google</Button>
					</View>
				)}
			</Surface>
		</View>
	);
}


