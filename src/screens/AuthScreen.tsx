import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
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
		<View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
			<Text style={{ fontSize: 24, fontWeight: '600' }}>Welcome</Text>
			<TextInput
				placeholder="Email"
				autoCapitalize="none"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
				style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
			/>
			<TextInput
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
			/>
			{busy ? <ActivityIndicator /> : (
				<View style={{ gap: 8 }}>
					<Button title="Sign In" onPress={signIn} />
					<Button title="Sign Up" onPress={signUp} />
					<Button title="Continue with Google" onPress={signInWithGoogle} />
				</View>
			)}
		</View>
	);
}


