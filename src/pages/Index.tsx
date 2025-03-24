
import React from 'react';
import Navbar from '../components/Navbar';
import { ListChecks, TrendingUp, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-earth-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-beaver-dark">BusyBeavers Habit Tracker</h1>
          
          <div className="flex justify-center mb-8">
            <img 
              src="/pics/logo.png" 
              alt="BusyBeavers Logo" 
              className="w-64 h-auto"
            />
          </div>
          
          <p className="text-lg text-gray-700 mb-8">Track your daily habits, build streaks, and earn points!</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-12 text-beaver-dark">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track Key Habits */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100">
                <ListChecks className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Track Key Habits</h3>
              <p className="text-gray-600 text-center">
                Monitor your daily habits across health, productivity, and mindfulness categories.
              </p>
            </div>
            
            {/* Build Streaks */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Build Streaks</h3>
              <p className="text-gray-600 text-center">
                Maintain consistency and watch your streak counters grow with each completed habit.
              </p>
            </div>
            
            {/* Earn Points */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Earn Points</h3>
              <p className="text-gray-600 text-center">
                Collect points for completed habits and track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
