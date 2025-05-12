
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLeaderboardUsers, 
  addUserToLeaderboard, 
  removeUserFromLeaderboard 
} from '@/services/leaderboardService';
import { useToast } from '@/hooks/use-toast';

type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useLeaderboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch leaderboard data
  const {
    data: leaderboardUsers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardUsers
  });

  // Mutation to add a user to the leaderboard
  const addUserMutation = useMutation({
    mutationFn: (email: string) => addUserToLeaderboard(email),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User added to your leaderboard',
      });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation to remove a user from the leaderboard
  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => removeUserFromLeaderboard(userId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User removed from your leaderboard',
      });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove user',
        variant: 'destructive',
      });
    },
  });

  // Enhanced addUser function with callbacks support
  const addUser = (email: string, callbacks?: MutationCallbacks) => {
    return addUserMutation.mutate(email, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error: Error) => {
        callbacks?.onError?.(error);
      }
    });
  };

  return {
    leaderboardUsers,
    isLoading,
    error,
    refetch,
    addUser,
    removeUser: removeUserMutation.mutate,
    isAddingUser: addUserMutation.isPending,
    isRemovingUser: removeUserMutation.isPending,
  };
};
