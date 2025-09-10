import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  Icon,
  IconButton,
  Provider as PaperProvider,
  useTheme,
} from 'react-native-paper';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { ThemeProvider, useThemeMode } from './src/providers/ThemeProvider';
import AboutScreen from './src/screens/AboutScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AuthScreen from './src/screens/AuthScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import HomeScreen from './src/screens/HomeScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import LandingScreen from './src/screens/LandingScreen';
import ProgressScreen from './src/screens/ProgressScreen';

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
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Activity':
              iconName = 'star';
              break;
            case 'Progress':
              iconName = 'chart-line';
              break;
            case 'Insights':
              iconName = 'lightbulb';
              break;
            case 'Family':
              iconName = 'account-group';
              break;
            case 'About':
              iconName = 'information-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }
          return <Icon source={iconName} color={color} size={size} />;
        },
        headerRight: () => (
          <IconButton
            accessibilityLabel='Toggle theme'
            icon={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
            onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          />
        ),
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name='Activity'
        component={ActivityScreen}
        options={{ title: 'Today' }}
      />
      <Tab.Screen
        name='Progress'
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen
        name='Insights'
        component={InsightsScreen}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen
        name='Family'
        component={FamilyScreen}
        options={{ title: 'Family' }}
      />
      <Tab.Screen
        name='About'
        component={AboutScreen}
        options={{ title: 'About' }}
      />
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
        <Stack.Screen
          name='Main'
          component={AuthenticatedTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name='Landing'
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Auth'
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function ThemedApp() {
  const { paperTheme, mode } = useThemeMode();
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer
        theme={mode === 'dark' ? NavDarkTheme : NavLightTheme}
      >
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
