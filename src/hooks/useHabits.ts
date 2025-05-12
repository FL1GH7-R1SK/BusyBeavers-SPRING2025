
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '@/services/habitService';
import { HabitWithStats, Habit } from '@/lib/db-types';
import { useToast } from '@/hooks/use-toast';

export const useHabits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
      toast({
        title: "Error",
        description: "Failed to complete habit.",
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: "Failed to mark habit as incomplete.",
        variant: "destructive"
      });
    },
  });

  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: habitService.createHabit,
    onSuccess: () => {
      console.log('Habit created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habitStats'] });
      refetchStats();
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Habit created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating habit:', error);
      setIsCreating(false);
      toast({
        title: "Error",
        description: "Failed to create habit.",
        variant: "destructive"
      });
    },
  });

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: habitService.deleteHabit,
    onSuccess: () => {
      console.log('Habit deleted successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habitStats'] });
      refetchStats();
      toast({
        title: "Success",
        description: "Habit deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit.",
        variant: "destructive"
      });
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

  // Delete habit
  const deleteHabit = (id: string) => {
    console.log('Deleting habit:', id);
    deleteHabitMutation.mutate(id);
    closeModal();
  };

  // Create new habit
  const createHabit = (habitData: Omit<Habit, 'id' | 'created_at' | 'user_id'>) => {
    console.log('Creating new habit:', habitData);
    setIsCreating(true);
    createHabitMutation.mutate(habitData);
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
    isCreating,
  };
};
