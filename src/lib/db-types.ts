
export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Fitness' | 'Learning' | 'Creativity' | 'Finance' | 'Social' | 'Other';

export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  category: HabitCategory;
  frequency: Frequency;
  created_at: string;
  streak?: number;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  total_completions?: number;
}

export interface HabitWithStats extends Habit {
  streak: number;
  completed: boolean;
  total_completions: number;
}

export type Database = {
  public: {
    Tables: {
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at'>;
        Update: Partial<Omit<Habit, 'id' | 'created_at' | 'user_id'>>;
      };
      habit_completions: {
        Row: HabitCompletion;
        Insert: Omit<HabitCompletion, 'id' | 'completed_at'>;
        Update: Partial<Omit<HabitCompletion, 'id' | 'completed_at' | 'user_id' | 'habit_id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
    };
  };
};

// Predefined habits array for new users
export const PREDEFINED_HABITS: Array<Omit<Habit, 'id' | 'created_at' | 'user_id' | 'streak'>> = [
  // Health category
  {
    name: 'Drink Water',
    description: 'Drink at least 8 glasses of water today',
    category: 'Health',
    frequency: 'Daily',
  },
  {
    name: 'Morning Run',
    description: 'Go for a 20-minute morning run',
    category: 'Health',
    frequency: 'Daily',
  },
  {
    name: 'Get 8 Hours of Sleep',
    description: 'Sleep for at least 8 hours',
    category: 'Health',
    frequency: 'Daily',
  },
  
  // Productivity category
  {
    name: 'Code Practice',
    description: 'Practice coding for at least 1 hour',
    category: 'Productivity',
    frequency: 'Daily',
  },
  {
    name: 'Study Session',
    description: 'Study for at least 2 hours',
    category: 'Productivity',
    frequency: 'Daily',
  },
  {
    name: 'Plan Tomorrow\'s Tasks',
    description: 'Create a to-do list for tomorrow',
    category: 'Productivity',
    frequency: 'Daily',
  },
  
  // Mindfulness category
  {
    name: 'Meditate',
    description: 'Meditate for at least 10 minutes',
    category: 'Mindfulness',
    frequency: 'Daily',
  },
  {
    name: 'Read 10 Pages',
    description: 'Read at least 10 pages of a book',
    category: 'Mindfulness',
    frequency: 'Daily',
  },
  {
    name: 'Touch Grass',
    description: 'Spend time outdoors in nature',
    category: 'Mindfulness',
    frequency: 'Daily',
  }
];
