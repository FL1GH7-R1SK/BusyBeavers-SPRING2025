import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PREDEFINED_HABITS } from '@/lib/db-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const createPredefinedHabits = async (userId: string) => {
    try {
      const habitsToInsert = PREDEFINED_HABITS.map(habit => ({
        ...habit,
        user_id: userId,
        streak: 0
      }));
      
      const { error } = await supabase
        .from('habits')
        .insert(habitsToInsert);
        
      if (error) {
        console.error('Error creating predefined habits:', error);
      }
    } catch (err) {
      console.error('Error in createPredefinedHabits:', err);
    }
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }
    
    if (!validatePassword(password)) {
      showError("Password must be at least 6 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      const { error, data } = await signUp(email, password);
      
      if (error) {
        showError(`Error signing up: ${error.message}`);
        return;
      }
      
      if (data?.user && !data.user.email_confirmed_at) {
        console.log("Check your email for a confirmation link");
      } else {
        console.log("Account created successfully!");
      }
      
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            name, 
            email: data.user.email,
            total_completions: 0 
          }]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
        
        await createPredefinedHabits(data.user.id);
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-sm border border-earth-tan">
          <h1 className="text-2xl font-bold mb-6 text-center text-beaver-dark">Sign Up</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-earth-tan rounded-md"
                placeholder="Your Name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-earth-tan rounded-md"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-earth-tan rounded-md"
                placeholder="********"
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-earth-tan rounded-md"
                placeholder="********"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-forest-green hover:bg-forest-dark text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-gray-600">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-beaver-brown hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-beaver-dark">Validation Error</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-forest-green hover:bg-forest-dark">OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;
