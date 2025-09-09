import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Prefer EXPO_PUBLIC_ env vars (supported on web and native),
// fallback to Expo Constants extra for native/dev.
const supabaseUrl =
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined) ||
  (Constants.expoConfig?.extra?.SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  (Constants.expoConfig?.extra?.SUPABASE_ANON_KEY as string | undefined);

if (!supabaseUrl) {
  throw new Error(
    'supabaseUrl is required. Set EXPO_PUBLIC_SUPABASE_URL or SUPABASE_URL.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'supabaseAnonKey is required. Set EXPO_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.'
  );
}

const isWeb = Platform.OS === 'web';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: isWeb
    ? {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    : {
        storage: {
          getItem: (key: string) => SecureStore.getItemAsync(key),
          setItem: (key: string, value: string) =>
            SecureStore.setItemAsync(key, value),
          removeItem: (key: string) => SecureStore.deleteItemAsync(key),
        },
        storageKey: 'supabase-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
});
