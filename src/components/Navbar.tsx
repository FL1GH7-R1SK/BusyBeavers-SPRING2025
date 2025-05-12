
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-beaver-brown to-beaver-dark text-white shadow-nav sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/pics/logo.png" alt="BusyBeavers" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold">BusyBeavers</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-beaver-highlight/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`hover:text-earth-tan transition-colors py-2 border-b-2 ${
                    isActive('/dashboard') ? 'border-earth-tan' : 'border-transparent'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/leaderboard" 
                  className={`hover:text-earth-tan transition-colors py-2 border-b-2 ${
                    isActive('/leaderboard') ? 'border-earth-tan' : 'border-transparent'
                  }`}
                >
                  Leaderboard
                </Link>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-beaver-dark"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`hover:text-earth-tan transition-colors py-2 border-b-2 ${
                    isActive('/login') ? 'border-earth-tan' : 'border-transparent'
                  }`}
                >
                  Login
                </Link>
                <Button 
                  asChild
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-beaver-dark"
                >
                  <Link to="/signup">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-beaver-highlight/30 mt-3 animate-fade-in">
            {user ? (
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md ${isActive('/dashboard') ? 'bg-beaver-highlight/30' : 'hover:bg-beaver-highlight/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/leaderboard" 
                  className={`px-3 py-2 rounded-md ${isActive('/leaderboard') ? 'bg-beaver-highlight/30' : 'hover:bg-beaver-highlight/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-beaver-dark w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md ${isActive('/login') ? 'bg-beaver-highlight/30' : 'hover:bg-beaver-highlight/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-3 py-2 rounded-md ${isActive('/signup') ? 'bg-beaver-highlight/30' : 'hover:bg-beaver-highlight/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
