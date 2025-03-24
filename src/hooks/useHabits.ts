import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '@/services/habitService';
import { HabitWithStats } from '@/lib/db-types';

export const useHabits = () => {
  const queryClient = useQueryClient();
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  // Fetch habits - ensuring no sorting is applied to the returned data
  const { 
    data: habits = [], 
    isLoading: habitsLoading, 
    error 
  } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getUserHabits,
  });

  // Fetch user stats
  const { 
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['habitStats'],
    queryFn: habitService.getUserStats,
    enabled: !habitsLoading,
  });

  // Complete habit
  const completeHabitMutation = useMutation({
    mutationFn: habitService.completeHabit,
    onSuccess: () => {
      console.log('Habit completed successfully, invalidating queries');
      // Force a refetch of both habits and stats
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habitStats'] });
      // Also directly refetch stats
      refetchStats();
    },
    onError: (error: any) => {
      console.error('Error completing habit:', error);
    },
  });

  // Uncomplete habit
  const uncompleteHabitMutation = useMutation({
    mutationFn: habitService.uncompleteHabit,
    onSuccess: () => {
      console.log('Habit marked as incomplete, invalidating queries');
      // Force a refetch of both habits and stats
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habitStats'] });
      // Also directly refetch stats
      refetchStats();
    },
    onError: (error: any) => {
      console.error('Error marking habit as incomplete:', error);
    },
  });

  // Open habit modal
  const openModal = (id: string) => {
    const habit = habits.find(h => h.id === id) || null;
    setSelectedHabit(habit);
  };

  // Close habit modal
  const closeModal = () => {
    setSelectedHabit(null);
  };

  // Complete habit
  const completeHabit = (id: string) => {
    console.log('Completing habit:', id);
    completeHabitMutation.mutate(id);
    closeModal();
  };

  // Mark habit as incomplete
  const incompleteHabit = (id: string) => {
    console.log('Marking habit as incomplete:', id);
    uncompleteHabitMutation.mutate(id);
    closeModal();
  };

  // For prototype, we're keeping these functions but they'll just log instead of using toasts
  const deleteHabit = (id: string) => {
    console.log('Feature not available: Deleting habits is not available in this prototype');
    closeModal();
  };

  const createHabit = () => {
    console.log('Feature not available: Creating habits is not available in this prototype');
  };

  const isLoading = habitsLoading || statsLoading;

  // Provide default stats if none are available
  const defaultStats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.completed).length,
    highestStreak: Math.max(...habits.map(h => h.streak || 0), 0),
    totalCompletions: 0,
    totalPoints: 0
  };

  return {
    habits,
    stats: stats || defaultStats,
    isLoading,
    error,
    selectedHabit,
    openModal,
    closeModal,
    completeHabit,
    incompleteHabit,
    deleteHabit,
    createHabit,
    isCreating: false,
  };
};
