-- Small Steps MVP Database Schema

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  age_min INTEGER NOT NULL CHECK (age_min >= 4),
  age_max INTEGER NOT NULL CHECK (age_max <= 10),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 15),
  materials_needed TEXT[] DEFAULT '{}',
  category VARCHAR(50) NOT NULL, -- 'creative', 'physical', 'educational', 'emotional', 'social'
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 3), -- 1=easy, 2=medium, 3=hard
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parenting insights table
CREATE TABLE IF NOT EXISTS insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'bonding', 'communication', 'development', 'behavior', 'emotions'
  age_range VARCHAR(10) NOT NULL, -- '4-6', '7-8', '9-10', 'all'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activities (completed activities with ratings and notes)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  kid_id UUID REFERENCES kids(id) ON DELETE CASCADE, -- Optional: which kid participated
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1=didn't like, 5=loved it
  notes TEXT, -- Reflection journal entry
  duration_actual INTEGER, -- Actual time spent in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User streaks and progress
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_activities INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User preferences for activity recommendations
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_difficulty INTEGER DEFAULT 2,
  preferred_duration_max INTEGER DEFAULT 15,
  notification_time TIME DEFAULT '18:00',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User bookmarked insights
CREATE TABLE IF NOT EXISTS user_insight_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, insight_id)
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insight_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Activities and insights are readable by all authenticated users
CREATE POLICY "Activities are viewable by authenticated users" ON activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Insights are viewable by authenticated users" ON insights
  FOR SELECT USING (auth.role() = 'authenticated');

-- User activities are private to each user
CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON user_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" ON user_activities
  FOR DELETE USING (auth.uid() = user_id);

-- User streaks are private to each user
CREATE POLICY "Users can view their own streaks" ON user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" ON user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- User preferences are private to each user
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- User bookmarks are private to each user
CREATE POLICY "Users can view their own bookmarks" ON user_insight_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON user_insight_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON user_insight_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for streak management
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  user_streak_record user_streaks%ROWTYPE;
  days_since_last_activity INTEGER;
BEGIN
  -- Get or create user streak record
  SELECT * INTO user_streak_record
  FROM user_streaks
  WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, total_activities, last_activity_date)
    VALUES (NEW.user_id, 1, 1, 1, CURRENT_DATE)
    RETURNING * INTO user_streak_record;
  ELSE
    -- Calculate days since last activity
    days_since_last_activity := CURRENT_DATE - COALESCE(user_streak_record.last_activity_date, CURRENT_DATE - 1);
    
    -- Update streak based on timing
    IF days_since_last_activity = 1 THEN
      -- Consecutive day, increment streak
      user_streak_record.current_streak := user_streak_record.current_streak + 1;
    ELSIF days_since_last_activity > 1 THEN
      -- Streak broken, reset to 1
      user_streak_record.current_streak := 1;
    END IF;
    
    -- Update longest streak if current is higher
    IF user_streak_record.current_streak > user_streak_record.longest_streak THEN
      user_streak_record.longest_streak := user_streak_record.current_streak;
    END IF;
    
    -- Update totals
    user_streak_record.total_activities := user_streak_record.total_activities + 1;
    user_streak_record.last_activity_date := CURRENT_DATE;
    user_streak_record.updated_at := NOW();
    
    UPDATE user_streaks SET
      current_streak = user_streak_record.current_streak,
      longest_streak = user_streak_record.longest_streak,
      total_activities = user_streak_record.total_activities,
      last_activity_date = user_streak_record.last_activity_date,
      updated_at = user_streak_record.updated_at
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update streaks when activities are completed
CREATE TRIGGER update_streak_on_activity
  AFTER INSERT ON user_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- Indexes for performance
CREATE INDEX idx_activities_age_range ON activities(age_min, age_max);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_completed_at ON user_activities(completed_at);
CREATE INDEX idx_insights_category ON insights(category);
CREATE INDEX idx_insights_age_range ON insights(age_range);
