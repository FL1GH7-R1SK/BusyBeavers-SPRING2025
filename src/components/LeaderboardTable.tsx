
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Trophy, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Profile = {
  id: string;
  name: string;
  email: string;
  total_completions: number;
};

const LeaderboardTable = () => {
  const { leaderboardUsers, isLoading, removeUser } = useLeaderboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!leaderboardUsers?.length) {
    return (
      <div className="bg-white p-6 rounded-md shadow text-center">
        <p className="text-gray-500">
          No users on your leaderboard yet. Add friends to compare progress!
        </p>
      </div>
    );
  }

  const renderRankBadge = (rank: number) => {
    switch(rank) {
      case 1:
        return (
          <Badge variant="default" className="bg-yellow-500 border-yellow-600">
            <Trophy className="h-3 w-3 mr-1" />
            1st
          </Badge>
        );
      case 2:
        return (
          <Badge variant="default" className="bg-gray-400 border-gray-500">
            <Medal className="h-3 w-3 mr-1" />
            2nd
          </Badge>
        );
      case 3:
        return (
          <Badge variant="default" className="bg-amber-700 border-amber-800">
            <Medal className="h-3 w-3 mr-1" />
            3rd
          </Badge>
        );
      default:
        return rank;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 text-center">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-32 text-right">Points</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardUsers.map((profile: Profile, index: number) => (
            <TableRow 
              key={profile.id}
              className={profile.id === user?.id ? 'bg-earth-tan/30' : ''}
            >
              <TableCell className="text-center font-medium">{renderRankBadge(index + 1)}</TableCell>
              <TableCell>
                {profile.id === user?.id ? (
                  <span className="font-bold text-forest-green">{profile.name}</span>
                ) : (
                  profile.name
                )}
              </TableCell>
              <TableCell className="text-right">{profile.total_completions * 10}</TableCell>
              <TableCell>
                {profile.id !== user?.id && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeUser(profile.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
