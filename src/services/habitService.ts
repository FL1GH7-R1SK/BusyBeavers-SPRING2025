
import { supabase } from '@/lib/supabase';
import { Habit, HabitCompletion, HabitWithStats, HabitCategory, Frequency } from '@/lib/db-types';
import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns';

// Pre-defined habits for the prototype
const PREDEFINED_HABITS: Array<Omit<Habit, 'id' | 'created_at' | 'user_id'>> = [
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

// Generate synthetic IDs for the predefined habits
const HABITS_WITH_IDS = PREDEFINED_HABITS.map((habit, index) => ({
  ...habit,
  id: `predefined-${index + 1}`,
  created_at: new Date().toISOString(),
  user_id: 'system'
}));

// Map to store completion status for predefined habits
const completionStatusMap = new Map<string, boolean>();

export const habitService = {
  // Get all habits for a user - return predefined habits for the prototype
  async getUserHabits(): Promise<HabitWithStats[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      // Get habits from Supabase, including the new streak column
      const { data: dbHabits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.user.id);
      
      if (habitsError && habitsError.code !== 'PGRST116') {
        console.error('Error fetching habits:', habitsError);
        // Continue with predefined habits rather than throwing
      }
      
      // Get completions for the habits from Supabase
      const today = new Date();
      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('completed_at', format(subDays(today, 30), 'yyyy-MM-dd'));
        
      if (completionsError) {
        console.error('Error fetching completions:', completionsError);
        // Continue with empty completions rather than throwing
      }
      
      // Use database habits if available, otherwise use predefined habits
      const habits = dbHabits?.length ? dbHabits : HABITS_WITH_IDS;
      
      // Add stats to the habits
      return habits.map(habit => {
        const habitCompletions = completions?.filter(c => c.habit_id === habit.id) || [];
        const isCompletedToday = habitCompletions.some(c => 
          isSameDay(parseISO(c.completed_at), today)
        ) || completionStatusMap.get(habit.id) === true;
        
        // Get streak from the database if available, otherwise calculate it
        let streak = habit.streak || 0;
        
        // In the case of predefined habits, calculate the streak manually
        if (habit.id.startsWith('predefined-') || streak === undefined) {
          streak = 0;
          let currentDay = subDays(today, 1); // Start from yesterday
          let streakBroken = false;
          
          while (!streakBroken) {
            const hasCompletion = habitCompletions.some(c => 
              isSameDay(parseISO(c.completed_at), currentDay)
            );
            
            if (hasCompletion) {
              streak += 1;
              currentDay = subDays(currentDay, 1);
            } else {
              streakBroken = true;
            }
          }
          
          // If completed today, include today in the streak
          if (isCompletedToday) {
            streak += 1;
          }
        }
        
        // Count total completions including in-memory completions
        const memoryCompletions = completionStatusMap.get(habit.id) === true ? 1 : 0;
        const totalCompletions = habitCompletions.length + 
                                (memoryCompletions > 0 && !habitCompletions.some(c => isSameDay(parseISO(c.completed_at), today)) 
                                 ? memoryCompletions : 0);
        
        return {
          ...habit,
          streak,
          completed: isCompletedToday,
          total_completions: totalCompletions
        };
      });
    } catch (error) {
      console.error('Error in getUserHabits:', error);
      return [];
    }
  },
  
  // For the prototype, createHabit is disabled but kept for future implementation
  async createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'user_id'>): Promise<Habit> {
    throw new Error('Creating new habits is not available in this prototype');
  },
  
  // Update a habit - not needed for the prototype but kept for future
  async updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'created_at' | 'user_id'>>): Promise<Habit> {
    throw new Error('Updating habits is not available in this prototype');
  },
  
  // Delete a habit - not needed for the prototype but kept for future
  async deleteHabit(id: string): Promise<void> {
    throw new Error('Deleting habits is not available in this prototype');
  },
  
  // Mark a habit as completed - using local storage for predefined habits
  async completeHabit(habitId: string): Promise<HabitCompletion> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    console.log(`Completing habit: ${habitId} for user: ${user.user.id}`);
    
    // Check if it's a predefined habit
    if (habitId.startsWith('predefined-')) {
      // Use in-memory map to track completion for predefined habits
      completionStatusMap.set(habitId, true);
      
      // Create a synthetic completion object
      const syntheticCompletion: HabitCompletion = {
        id: `completion-${Date.now()}`,
        habit_id: habitId,
        user_id: user.user.id,
        completed_at: new Date().toISOString()
      };
      
      return syntheticCompletion;
    }
    
    // Get the current habit to update its streak
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('streak')
      .eq('id', habitId)
      .single();
    
    if (habitError) {
      console.error('Error fetching habit for streak update:', habitError);
    }
    
    // Calculate new streak value
    const newStreak = (habit?.streak || 0) + 1;
    console.log(`Updating streak from ${habit?.streak || 0} to ${newStreak}`);
    
    // Update the habit's streak
    const { error: updateError } = await supabase
      .from('habits')
      .update({ streak: newStreak })
      .eq('id', habitId);
    
    if (updateError) {
      console.error('Error updating habit streak:', updateError);
    }
    
    // Get user profile to update total_completions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_completions')
      .eq('id', user.user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile for total_completions update:', profileError);
      // If there's an error, we'll create a profile record
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.user.id,
          total_completions: 1,
          name: user.user.user_metadata?.name || '',
          email: user.user.email || ''
        }]);
        
      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
      } else {
        console.log('Created new profile with total_completions = 1');
      }
    } else {
      // Update profile total_completions
      const newTotalCompletions = (profile?.total_completions || 0) + 1;
      console.log(`Updating total_completions from ${profile?.total_completions || 0} to ${newTotalCompletions}`);
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ total_completions: newTotalCompletions })
        .eq('id', user.user.id);
      
      if (profileUpdateError) {
        console.error('Error updating profile total_completions:', profileUpdateError);
      } else {
        console.log('Successfully updated profile total_completions');
      }
    }
    
    // Record the completion
    const { data, error } = await supabase
      .from('habit_completions')
      .insert([{ 
        habit_id: habitId, 
        user_id: user.user.id,
        completed_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    console.log('Habit completion recorded successfully');
    return data;
  },
  
  // Remove completion for today - handle both real and predefined habits
  async uncompleteHabit(habitId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Check if it's a predefined habit
    if (habitId.startsWith('predefined-')) {
      // Use in-memory map to track completion
      completionStatusMap.set(habitId, false);
      return;
    }
    
    // Get the current habit to update its streak
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('streak')
      .eq('id', habitId)
      .single();
    
    if (habitError) {
      console.error('Error fetching habit for streak update:', habitError);
    }
    
    // Calculate new streak value (minimum 0)
    const newStreak = Math.max((habit?.streak || 0) - 1, 0);
    
    // Update the habit's streak
    const { error: updateError } = await supabase
      .from('habits')
      .update({ streak: newStreak })
      .eq('id', habitId);
    
    if (updateError) {
      console.error('Error updating habit streak:', updateError);
    }
    
    // Get user profile to update total_completions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_completions')
      .eq('id', user.user.id)
      .single();
    
    if (!profileError && profile && profile.total_completions > 0) {
      // Update profile total_completions (minimum 0)
      const newTotalCompletions = Math.max((profile.total_completions || 0) - 1, 0);
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ total_completions: newTotalCompletions })
        .eq('id', user.user.id);
      
      if (profileUpdateError) {
        console.error('Error updating profile total_completions:', profileUpdateError);
      }
    }
    
    // Delete the completion record
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
    
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', user.user.id)
      .gte('completed_at', startOfDay)
      .lte('completed_at', endOfDay);
      
    if (error) throw error;
  },
  
  // Get user stats - now properly using the profile's total_completions for points calculation
  async getUserStats() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      console.log('Fetching stats for user:', user.user.id);
      
      // Get the user's profile with total_completions
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_completions')
        .eq('id', user.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile stats:', profileError);
        console.log('Profile error code:', profileError.code);
        console.log('Profile error message:', profileError.message);
      }
      
      console.log('Profile data:', profile);
      
      // Get habits to calculate highest streak and completed today
      // THIS IS THE FIXED LINE - we're now using habitService.getUserHabits() instead of this.getUserHabits()
      const habits = await habitService.getUserHabits();
      
      const totalHabits = habits.length;
      const completedToday = habits.filter(h => h.completed).length;
      const highestStreak = Math.max(...habits.map(h => h.streak || 0), 0);
      
      // Use total_completions from profile to calculate points
      const totalCompletions = profile?.total_completions || 0;
      console.log('Total completions from profile:', totalCompletions);
      
      // Points calculation (10 points per completion)
      const totalPoints = totalCompletions * 10;
      
      const stats = {
        totalHabits,
        completedToday,
        highestStreak,
        totalCompletions,
        totalPoints
      };
      
      console.log('Returning stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        totalHabits: 0,
        completedToday: 0,
        highestStreak: 0,
        totalCompletions: 0,
        totalPoints: 0
      };
    }
  }
};
