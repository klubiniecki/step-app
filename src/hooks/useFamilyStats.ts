import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  getChildActivityStats,
  getParentActivityStats,
} from '../lib/statistics';
import type { ChildActivityStats, ParentActivityStats } from '../lib/types';

export function useFamilyStats() {
  const [childStats, setChildStats] = useState<ChildActivityStats[]>([]);
  const [parentStats, setParentStats] = useState<ParentActivityStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const loadFamilyStats = useCallback(async () => {
    try {
      setLoading(true);
      const [childData, parentData] = await Promise.all([
        getChildActivityStats(),
        getParentActivityStats(),
      ]);

      setChildStats(childData);
      setParentStats(parentData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load family statistics';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFamilyStats();
  }, [loadFamilyStats]);

  return {
    childStats,
    parentStats,
    loading,
    loadFamilyStats,
  };
}
