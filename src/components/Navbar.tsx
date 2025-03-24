
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-beaver-brown text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          BusyBeavers
        </Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-earth-tan">
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:text-earth-tan hover:bg-transparent p-0"
                onClick={signOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-earth-tan">
                Login
              </Link>
              <Link to="/signup" className="hover:text-earth-tan">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
