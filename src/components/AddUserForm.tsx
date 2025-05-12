
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Search, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddUserFormProps {
  onSuccess?: () => void;
}

const AddUserForm = ({ onSuccess }: AddUserFormProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addUser, isAddingUser } = useLeaderboard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous error
    setError(null);
    
    if (email.trim() && !isAddingUser) {
      // Submit email and handle errors locally
      addUser(email, {
        onError: (error: Error) => {
          setError(error.message);
        },
        onSuccess: () => {
          setEmail('');
          if (onSuccess) {
            onSuccess();
          }
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">User Email</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="email"
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // Clear error when user types
              }}
              className={`w-full ${error ? 'border-red-500' : ''}`}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-forest-green hover:bg-forest-dark" 
            disabled={isAddingUser || !email.trim()}
          >
            {isAddingUser ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isAddingUser ? 'Searching...' : 'Add User'}
          </Button>
        </div>
        
        {error ? (
          <Alert variant="destructive" className="py-2 mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-gray-500">
            Enter the email address of a registered user to add them to your leaderboard.
            The search is not case-sensitive.
          </p>
        )}
      </div>
    </form>
  );
};

export default AddUserForm;
