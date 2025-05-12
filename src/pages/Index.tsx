
import React from 'react';
import Navbar from '../components/Navbar';
import { ListChecks, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-light to-earth-accent/20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-beaver-dark leading-tight">
              Build Better Habits with <span className="text-forest-green">BusyBeavers</span>
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Track your daily habits, build impressive streaks, and earn points to climb the leaderboard!
            </p>
            
            <div className="flex space-x-4">
              <Button asChild className="bg-forest-green hover:bg-forest-dark text-white px-6 py-2 rounded-lg">
                <Link to="/signup" className="flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-beaver-brown text-beaver-brown hover:bg-beaver-brown hover:text-white">
                <Link to="/login">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-forest-green to-beaver-brown opacity-30 blur-lg"></div>
              <img 
                src="/pics/logo.png" 
                alt="BusyBeavers Logo" 
                className="relative w-64 h-auto rounded-full shadow-lg transform transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-beaver-dark">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Track Key Habits */}
            <div className="bg-earth-light p-8 rounded-lg shadow-card card-hover">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-forest-light/30 mx-auto">
                <ListChecks className="w-8 h-8 text-forest-dark" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-beaver-dark">Track Key Habits</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Monitor your daily habits across health, productivity, and mindfulness categories.
              </p>
            </div>
            
            {/* Build Streaks */}
            <div className="bg-earth-light p-8 rounded-lg shadow-card card-hover">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-beaver-light/30 mx-auto">
                <TrendingUp className="w-8 h-8 text-beaver-dark" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-beaver-dark">Build Streaks</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Maintain consistency and watch your streak counters grow with each completed habit.
              </p>
            </div>
            
            {/* Earn Points */}
            <div className="bg-earth-light p-8 rounded-lg shadow-card card-hover">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-forest-light/30 mx-auto">
                <Award className="w-8 h-8 text-forest-dark" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-beaver-dark">Earn Points</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Collect points for completed habits and track your progress over time with friends.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-beaver-brown to-beaver-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your habits?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building better habits and reaching their goals with BusyBeavers.
          </p>
          <Button asChild className="bg-white text-beaver-dark hover:bg-earth-tan px-8 py-2">
            <Link to="/signup">
              Sign Up Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
