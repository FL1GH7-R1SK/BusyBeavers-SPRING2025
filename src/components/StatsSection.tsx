
import React from 'react';

interface StatsSectionProps {
  highestStreak: number;
  totalPoints: number;
  totalHabits: number;
  completedToday: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({ 
  highestStreak, 
  totalPoints,
  totalHabits,
  completedToday
}) => {
  // Calculate completion percentage for today
  const completionPercentage = totalHabits > 0 
    ? Math.round((completedToday / totalHabits) * 100) 
    : 0;

  console.log('StatsSection rendering with:', { highestStreak, totalPoints, totalHabits, completedToday });

  return (
    <div className="bg-earth-tan border border-earth-dark rounded-md p-4 mt-6">
      <h2 className="text-lg font-bold mb-3 text-beaver-dark">Your Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Highest Streak</p>
          <p className="text-2xl font-bold text-forest-green">{highestStreak} days</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-2xl font-bold text-beaver-brown">{totalPoints} pts</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total Habits</p>
          <p className="text-2xl font-bold text-forest-green">{totalHabits}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Completed Today</p>
          <p className="text-2xl font-bold text-beaver-brown">
            {completedToday} 
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({completionPercentage}%)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
