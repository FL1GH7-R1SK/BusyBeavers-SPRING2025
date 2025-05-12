
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Error signing in:', error.message);
        toast.error(error.message || "Invalid login credentials");
        setLoading(false);
        return;
      }
      
      console.log('Login successful');
      toast.success("Login successful");
      navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-light to-earth-accent/20">
      <Navbar />
      <Toaster position="bottom-right" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-card border border-earth-tan animate-fade-in">
          <h1 className="text-2xl font-bold mb-2 text-center text-beaver-dark">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium text-sm" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-earth-tan focus:border-forest-green focus:ring-forest-light rounded-md"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium text-sm" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-earth-tan focus:border-forest-green focus:ring-forest-light rounded-md pr-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-beaver-brown to-beaver-dark hover:from-beaver-dark hover:to-beaver-dark text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-forest-green hover:text-forest-dark hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
