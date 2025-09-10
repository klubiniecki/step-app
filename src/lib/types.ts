// Small Steps MVP Types

export interface Activity {
  id: string;
  title: string;
  description: string;
  instructions: string;
  age_min: number;
  age_max: number;
  duration_minutes: number;
  materials_needed: string[];
  category: 'creative' | 'physical' | 'educational' | 'emotional' | 'social';
  difficulty_level: 1 | 2 | 3;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  category:
    | 'bonding'
    | 'communication'
    | 'development'
    | 'behavior'
    | 'emotions';
  age_range: '4-6' | '7-8' | '9-10' | 'all';
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_id: string;
  kid_id?: string;
  completed_at: string;
  rating?: number;
  notes?: string;
  duration_actual?: number;
  created_at: string;
  // Joined data
  activity?: Activity;
  kid?: {
    id: string;
    name: string;
    age: number;
  };
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_activities: number;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_categories: string[];
  preferred_difficulty: number;
  preferred_duration_max: number;
  notification_time: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityRecommendation {
  activity: Activity;
  reason: string;
  match_score: number;
}

export interface DailyActivity {
  activity: Activity;
  is_completed: boolean;
  user_activity?: UserActivity;
  streak_count: number;
}

export interface ActivityFilters {
  age_min?: number;
  age_max?: number;
  category?: string;
  difficulty_level?: number;
  duration_max?: number;
  exclude_completed?: boolean;
}
