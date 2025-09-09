import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

function Routes() {
	const { session, loading } = useAuth();

	if (loading) {
		return null;
	}

	return (
		<Stack.Navigator>
			{session ? (
				<Stack.Screen name="Home" component={HomeScreen} />
			) : (
				<Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
			)}
		</Stack.Navigator>
	);
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
