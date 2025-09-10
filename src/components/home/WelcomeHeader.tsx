import React from 'react';
import { Surface, Text } from 'react-native-paper';

interface WelcomeHeaderProps {
  displayName?: string;
}

export function WelcomeHeader({ displayName }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Surface
      elevation={1}
      style={{ padding: 20, borderRadius: 12, marginBottom: 16 }}
    >
      <Text variant='headlineSmall' style={{ marginBottom: 8 }}>
        {getGreeting()}, {displayName || 'Parent'}! 👋
      </Text>
      <Text variant='bodyMedium' style={{ color: '#666' }}>
        Ready for today&apos;s small step with your little ones?
      </Text>
    </Surface>
  );
}
