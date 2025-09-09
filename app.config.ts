import 'dotenv/config';

export default {
	expo: {
		name: "supabase-auth-app",
		slug: "supabase-auth-app",
		scheme: "supabaseauth",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff"
		},
		plugins: [
			"expo-secure-store",
			"expo-web-browser"
		],
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.example.supabaseauthapp"
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff"
			}
		},
		web: {
			bundler: "metro"
		},
		extra: {
			SUPABASE_URL: process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL,
			SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
			SUPABASE_REDIRECT_SCHEME: "supabaseauth",
			EAS_BUILD: process.env.EAS_BUILD
		}
	}
};


