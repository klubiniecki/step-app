import React from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { DailyInsight } from '../components/home/DailyInsight';
import { FamilyOverview } from '../components/home/FamilyOverview';
import { NoActivityCard } from '../components/home/NoActivityCard';
import { QuickActions } from '../components/home/QuickActions';
import { QuickStats } from '../components/home/QuickStats';
import { TodaysActivityCard } from '../components/home/TodaysActivityCard';
import { WelcomeHeader } from '../components/home/WelcomeHeader';
import { useHomeData } from '../hooks/useHomeData';
import { useAuth } from '../providers/AuthProvider';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { dailyActivity, streakStats, randomInsight, kids, loading } =
    useHomeData();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
        <Text style={{ marginTop: 16 }}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Welcome Header */}
      <WelcomeHeader displayName={user?.user_metadata?.display_name} />

      {/* Quick Stats */}
      {streakStats && <QuickStats streakStats={streakStats} />}

      {/* Today's Activity Preview */}
      {dailyActivity ? (
        <TodaysActivityCard dailyActivity={dailyActivity} />
      ) : (
        <NoActivityCard />
      )}

      {/* Family Overview */}
      <FamilyOverview kids={kids} />

      {/* Daily Insight */}
      {randomInsight && <DailyInsight insight={randomInsight} />}

      {/* Quick Actions */}
      <QuickActions />

      {/* Sign Out */}
      <Button mode='text' onPress={signOut} icon='logout' textColor='#666'>
        Sign Out
      </Button>
    </ScrollView>
  );
}
