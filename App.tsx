import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeMode } from './src/providers/ThemeProvider';
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, IconButton, useTheme } from 'react-native-paper';
import AboutScreen from './src/screens/AboutScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import AuthScreen from './src/screens/AuthScreen';
import LandingScreen from './src/screens/LandingScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthenticatedTabs() {
	const { mode, setMode } = useThemeMode();
	const { colors } = useTheme();
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.onSurfaceVariant,
				tabBarIcon: ({ color, size }) => (
					<Icon source={route.name === 'Home' ? 'home' : 'information-outline'} color={color} size={size} />
				),
				headerRight: () => (
					<IconButton
						accessibilityLabel="Toggle theme"
						icon={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
						onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
					/>
				),
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
			<Tab.Screen name="Family" component={FamilyScreen} options={{ title: 'Family' }} />
			<Tab.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
		</Tab.Navigator>
	);
}

function Routes() {
	const { session, loading } = useAuth();

	if (loading) {
		return null;
	}

	return (
		<Stack.Navigator>
			{session ? (
				<Stack.Screen name="Main" component={AuthenticatedTabs} options={{ headerShown: false }} />
			) : (
				<>
					<Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
				</>
			)}
		</Stack.Navigator>
	);
}

function ThemedApp() {
	const { paperTheme, mode } = useThemeMode();
	return (
		<PaperProvider theme={paperTheme}>
			<NavigationContainer theme={mode === 'dark' ? NavDarkTheme : NavLightTheme}>
				<Routes />
			</NavigationContainer>
		</PaperProvider>
	);
}

export default function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<ThemedApp />
			</AuthProvider>
		</ThemeProvider>
	);
}
