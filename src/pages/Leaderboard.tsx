
import React from 'react';
import Navbar from '@/components/Navbar';
import LeaderboardTable from '@/components/LeaderboardTable';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import AddUserForm from '@/components/AddUserForm';

const Leaderboard = () => {
  const { user } = useAuth();
  const [addFriendOpen, setAddFriendOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-earth-light">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-beaver-dark">Leaderboard</h1>
          
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-beaver-dark">Rankings</h2>
            <LeaderboardTable />
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => setAddFriendOpen(true)}
                className="bg-forest-green hover:bg-forest-dark flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Friends
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={addFriendOpen} onOpenChange={setAddFriendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Friend to Leaderboard</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Add friends by email to see how your habit progress compares!
            </p>
            <AddUserForm 
              onSuccess={() => setAddFriendOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
};

export default Leaderboard;
