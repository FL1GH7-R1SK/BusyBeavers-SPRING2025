
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import StatsSection from '../components/StatsSection';
import { useHabits } from '@/hooks/useHabits';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import AddHabitModal from '@/components/AddHabitModal';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const {
    habits,
    stats,
    isLoading,
    selectedHabit,
    openModal,
    closeModal,
    completeHabit,
    incompleteHabit,
    deleteHabit,
    createHabit,
    isCreating,
  } = useHabits();

  // State for managing add habit modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get user's name or fall back to email if name not available
  const getUserName = () => {
    if (!user) return "My";
    
    // Use user profile name if available
    if (userProfile?.name) {
      return `${userProfile.name}'s`;
    }
    
    // Fall back to email if no name is available
    const email = user.email || "";
    const nameFromEmail = email.split('@')[0];
    
    // Capitalize first letter of name from email
    const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    return `${displayName}'s`;
  };

  // Simply group habits by category with no sorting at all
  const habitsByCategory = habits.reduce<Record<string, typeof habits>>((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-earth-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{getUserName()} Dashboard</h1>
        </div>
        
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <StatsSection 
              highestStreak={stats.highestStreak} 
              totalPoints={stats.totalPoints}
              totalHabits={stats.totalHabits}
              completedToday={stats.completedToday}
            />
            
            {/* Add Habit button moved here, below stats section */}
            <div className="flex justify-end mt-6 mb-6">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-forest-green hover:bg-forest-dark text-white flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Habit
              </Button>
            </div>
            
            {habits.length === 0 ? (
              <div className="bg-white p-8 rounded-md shadow-sm mt-8 text-center">
                <p className="text-lg mb-4">Loading your habits...</p>
              </div>
            ) : (
              Object.entries(habitsByCategory).map(([category, habits]) => (
                <div key={category} className="mt-8">
                  <h2 className="text-xl font-semibold mb-3 text-beaver-dark border-b border-earth-tan pb-2">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habits.map(habit => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onOpenModal={openModal}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
      
      {selectedHabit && (
        <HabitModal 
          habit={selectedHabit} 
          onClose={closeModal} 
          onComplete={completeHabit}
          onIncomplete={incompleteHabit}
          onDelete={deleteHabit}
        />
      )}
      
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={createHabit}
        isLoading={isCreating}
      />
    </div>
  );
};

export default Dashboard;
